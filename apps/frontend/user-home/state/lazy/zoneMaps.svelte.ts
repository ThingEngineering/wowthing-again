import uniq from 'lodash/uniq';
import { DateTime } from 'luxon';
import { get } from 'svelte/store';

import { classByArmorTypeString } from '@/data/character-class';
import { Constants } from '@/data/constants';
import { covenantSlugMap } from '@/data/covenant';
import { expansionShortNameMap } from '@/data/expansion';
import { factionMap } from '@/data/faction';
import { questToLockout } from '@/data/quests';
import { transmogTypes } from '@/data/transmog';
import { FarmResetType } from '@/enums/farm-reset-type';
import { FarmType } from '@/enums/farm-type';
import { PlayableClass, PlayableClassMask } from '@/enums/playable-class';
import { RewardType } from '@/enums/reward-type';
import { settingsState } from '@/shared/state/settings.svelte';
import { wowthingData } from '@/shared/stores/data';
import { zoneMapState } from '@/stores/local-storage';
import { UserCount } from '@/types';
import { getSetCurrencyCostsString } from '@/utils/get-currency-costs';
import {
    getNextBiWeeklyReset,
    getNextDailyReset,
    getNextWeeklyReset,
} from '@/utils/get-next-reset';
import getTransmogClassMask from '@/utils/get-transmog-class-mask';
import { getVendorDropStats } from '@/utils/get-vendor-drop-stats';
import { isRecipeKnown } from '@/utils/professions/is-recipe-known';
import type { DropStatus, FarmStatus } from '@/types/zone-maps';

import { userState } from '../user';

type classMaskStrings = keyof typeof PlayableClassMask;

export interface LazyZoneMaps {
    counts: Record<string, UserCount>;
    farmStatus: Record<string, FarmStatus[]>;
    typeCounts: Record<string, Record<RewardType, UserCount>>;
}

export function doZoneMaps(): LazyZoneMaps {
    console.time('LazyState.doZoneMaps');

    const classMask = getTransmogClassMask();
    const completionistMode = settingsState.value.transmog.completionistMode;
    const zoneMapStateValue = get(zoneMapState);

    const now = DateTime.utc();

    const farmData: Record<string, FarmStatus[]> = {};
    const setCounts: Record<string, UserCount> = {};
    const typeCounts: Record<string, Record<number, UserCount>> = {};

    const shownCharacters = userState.general.characters.filter(
        (c) =>
            settingsState.value.characters.hiddenCharacters.indexOf(c.id) === -1 &&
            settingsState.value.characters.ignoredCharacters.indexOf(c.id) === -1 &&
            (!settingsState.value.characters.hideDisabledAccounts ||
                settingsState.value.accounts?.[c.accountId]?.enabled !== false)
    );
    const overallCounts = (setCounts['OVERALL'] = new UserCount());
    const resetMap = Object.fromEntries(
        Array.from(userState.quests.characterById.entries()).map(
            ([characterId, characterQuests]) => [
                characterId,
                {
                    daily: getNextDailyReset(
                        characterQuests.scannedAt,
                        userState.general.characterById[characterId]?.realm?.region ?? 1
                    ),
                    biWeekly: getNextBiWeeklyReset(
                        characterQuests.scannedAt,
                        userState.general.characterById[characterId]?.realm?.region ?? 1
                    ),
                    weekly: getNextWeeklyReset(
                        characterQuests.scannedAt,
                        userState.general.characterById[characterId]?.realm?.region ?? 1
                    ),
                },
            ]
        )
    );

    for (const maps of wowthingData.manual.zoneMaps.sets) {
        if (maps === null) {
            continue;
        }

        const categoryCounts = (setCounts[maps[0].slug] = new UserCount());
        const categorySeen: Record<number, Record<number, boolean>> = {};

        const categoryCharacters = shownCharacters.filter(
            (char) =>
                char.level >= maps[0].minimumLevel &&
                (maps[0].requiredQuestIds.length === 0 ||
                    maps[0].requiredQuestIds.some((questId) =>
                        userState.quests.characterById.get(char.id)?.hasQuestById?.has(questId)
                    ))
        );

        for (const map of maps.slice(1)) {
            if (map === null) {
                continue;
            }

            const mapKey = `${maps[0].slug}--${map.slug}`;
            const mapCounts = (setCounts[mapKey] = new UserCount());
            const mapTypeCounts: Record<number, UserCount> = (typeCounts[mapKey] =
                Object.fromEntries(Object.keys(RewardType).map((key) => [key, new UserCount()])));

            const mapSeen: Record<string, Record<number, boolean>> = {};

            let mapClassMask = 0;
            const activeClasses = Object.entries(zoneMapStateValue.classFilters[mapKey] || {})
                .filter(([, value]) => value === true)
                .map(([key]) => parseInt(key));

            for (const classId of activeClasses) {
                mapClassMask |= PlayableClassMask[PlayableClass[classId] as classMaskStrings];
            }

            const eligibleCharacters = categoryCharacters.filter(
                (char) =>
                    char.level >= map.minimumLevel &&
                    (map.requiredQuestIds.length === 0 ||
                        map.requiredQuestIds.some((questId) =>
                            userState.quests.characterById.get(char.id)?.hasQuestById?.has(questId)
                        )) &&
                    (mapClassMask === 0 ||
                        (mapClassMask &
                            wowthingData.static.characterClassById.get(char.classId).mask) >
                            0) &&
                    (zoneMapStateValue.maxLevelOnly === false ||
                        char.level === Constants.characterMaxLevel)
            );

            const farms = [...map.farms];

            for (const vendorId of wowthingData.manual.shared.vendorsByMap[map.mapName] || []) {
                farms.push(...wowthingData.manual.shared.vendors[vendorId].asFarms(map.mapName));
            }

            farms.push(
                ...wowthingData.db
                    .search({ maps: [map.mapName] })
                    .map((thing) => thing.asZoneMapsFarm(map.mapName))
                    .filter((farm) => !!farm)
            );

            const farmStatuses: FarmStatus[] = [];
            for (const farm of farms) {
                const farmStatus: FarmStatus = {
                    characters: [],
                    drops: [],
                    need: false,
                };

                let expiredFunc: (characterId: number) => boolean;
                if (farm.reset === FarmResetType.Weekly) {
                    expiredFunc = (characterId) => resetMap[characterId]?.weekly < now;
                } else if (farm.reset === FarmResetType.BiWeekly) {
                    expiredFunc = (characterId) => resetMap[characterId]?.biWeekly < now;
                } else if (farm.reset === FarmResetType.Daily) {
                    expiredFunc = (characterId) => resetMap[characterId]?.daily < now;
                } else if (farm.reset === FarmResetType.None) {
                    expiredFunc = () => false;
                } else {
                    expiredFunc = () => false;
                }

                let farmCharacters = eligibleCharacters;
                if (farm.minimumLevel > 0) {
                    farmCharacters = farmCharacters.filter((c) => c.level >= farm.minimumLevel);
                }
                if (farm.requiredQuestIds?.length > 0) {
                    farmCharacters = farmCharacters.filter((c) =>
                        farm.requiredQuestIds.some((q) =>
                            userState.quests.characterById.get(c.id)?.hasQuestById?.has(q)
                        )
                    );
                }
                if (farm.faction) {
                    farmCharacters = farmCharacters.filter(
                        (c) => c.faction === factionMap[farm.faction]
                    );
                }

                for (const drop of farm.drops || []) {
                    let dropCharacters = farmCharacters;
                    const dropStatus: DropStatus = {
                        need: false,
                        skip: false,
                        validCharacters: true,
                        characterIds: [],
                        completedCharacterIds: [],
                    };

                    let fixedType = drop.type;
                    switch (drop.type) {
                        case RewardType.Item:
                            if (wowthingData.manual.dragonridingItemToQuest.has(drop.id)) {
                                dropStatus.need = !userState.quests.accountHasById.has(
                                    wowthingData.manual.dragonridingItemToQuest.get(drop.id)
                                );
                            } else if (wowthingData.manual.druidFormItemToQuest.has(drop.id)) {
                                dropStatus.need = !userState.quests.accountHasById.has(
                                    wowthingData.manual.druidFormItemToQuest.get(drop.id)
                                );
                            } else if (wowthingData.static.professionAbilityByItemId.has(drop.id)) {
                                const abilityInfo =
                                    wowthingData.static.professionAbilityByItemId.get(drop.id);
                                dropStatus.need = !isRecipeKnown({ abilityInfo });
                            } else if (wowthingData.static.mountByItemId.has(drop.id)) {
                                dropStatus.need = !userState.general.hasMountById.has(
                                    wowthingData.static.mountByItemId.get(drop.id).id
                                );
                            } else if (wowthingData.static.petByItemId.has(drop.id)) {
                                dropStatus.need = !userState.general.hasPetById.has(
                                    wowthingData.static.petByItemId.get(drop.id).id
                                );
                            } else if (wowthingData.static.toyByItemId.has(drop.id)) {
                                dropStatus.need = !userState.general.hasToyByItemId.has(drop.id);
                            } else {
                                dropStatus.need = true;
                            }
                            break;

                        case RewardType.Achievement:
                            // FIXME criteria
                            // if (drop.subType > 0) {
                            //     if (!stores.userAchievementData.criteria[drop.subType]) {
                            //         dropStatus.need = true;
                            //     }
                            // } else {
                            dropStatus.need = !userState.achievements.achievementEarnedById.has(
                                drop.id
                            );
                            // }
                            break;

                        case RewardType.Currency:
                        case RewardType.Reputation:
                            dropStatus.need = true;
                            break;

                        case RewardType.Mount:
                            if (!userState.general.hasMountById.has(drop.id)) {
                                dropStatus.need = true;
                            }
                            break;

                        case RewardType.Pet:
                            if (!userState.general.hasPetById.has(drop.id)) {
                                dropStatus.need = true;
                            }
                            break;

                        case RewardType.Quest:
                        case RewardType.CharacterTrackingQuest:
                            if (
                                !Array.from(userState.quests.characterById.values()).every((char) =>
                                    char.hasQuestById.has(drop.id)
                                )
                            ) {
                                dropStatus.need = true;
                            }
                            break;

                        case RewardType.Toy:
                            if (!userState.general.hasToyById.has(drop.id)) {
                                dropStatus.need = true;
                            }
                            break;

                        case RewardType.XpQuest:
                            if (
                                !Object.values(userState.general.characters).every(
                                    (char) =>
                                        char.isMaxLevel ||
                                        !!userState.quests.characterById
                                            .get(char.id)
                                            ?.hasQuestById?.has(drop.id)
                                )
                            ) {
                                dropStatus.need = true;
                            }
                            break;

                        case RewardType.Armor:
                        case RewardType.Cosmetic:
                        case RewardType.Weapon:
                        case RewardType.Transmog:
                            if (drop.appearanceIds?.length > 0) {
                                dropStatus.need = drop.appearanceIds[0].some(
                                    (appearanceId) =>
                                        !userState.general.hasAppearanceById.has(appearanceId)
                                );
                            } else {
                                const itemAppearances =
                                    wowthingData.items.items[drop.id]?.appearances || {};

                                let modifier = 0;
                                // If there's no default appearanceId, check for there only being one possibility
                                if (!itemAppearances?.[modifier]) {
                                    const keys = Object.keys(itemAppearances);
                                    if (keys.length === 1) {
                                        modifier = parseInt(keys[0]);
                                    }
                                }

                                dropStatus.need ||= completionistMode
                                    ? !userState.general.hasAppearanceBySource.has(
                                          drop.id * 1000 + modifier
                                      )
                                    : !userState.general.hasAppearanceById.has(
                                          itemAppearances[modifier]?.appearanceId || 0
                                      );
                            }
                            fixedType = RewardType.Transmog;
                            break;

                        case RewardType.Illusion:
                            dropStatus.need = userState.general.hasIllusionByEnchantmentId.has(
                                drop.appearanceIds[0][0]
                            );
                            break;

                        case RewardType.SetSpecial:
                            [dropStatus.setHave, dropStatus.setNeed] = getVendorDropStats(
                                settingsState.value,
                                completionistMode,
                                drop
                            );
                            dropStatus.need = dropStatus.setHave < dropStatus.setNeed;

                            dropStatus.setNote = getSetCurrencyCostsString(
                                drop.appearanceIds,
                                drop.costs,
                                (appearanceId) =>
                                    userState.general.hasAppearanceById.has(appearanceId)
                            );

                            break;
                    }

                    dropStatus.skip =
                        (farm.type === FarmType.Achievement &&
                            !zoneMapStateValue.trackAchievements) ||
                        (farm.type === FarmType.Quest && !zoneMapStateValue.trackQuests) ||
                        (farm.type === FarmType.Vendor && !zoneMapStateValue.trackVendors) ||
                        (drop.type === RewardType.Achievement &&
                            !zoneMapStateValue.trackAchievements) ||
                        (drop.type === RewardType.Mount && !zoneMapStateValue.trackMounts) ||
                        (drop.type === RewardType.Pet && !zoneMapStateValue.trackPets) ||
                        ((drop.type === RewardType.Quest ||
                            drop.type === RewardType.XpQuest ||
                            drop.type === RewardType.CharacterTrackingQuest) &&
                            !zoneMapStateValue.trackQuests) ||
                        (drop.type === RewardType.Toy && !zoneMapStateValue.trackToys) ||
                        (transmogTypes.has(drop.type) && !zoneMapStateValue.trackTransmog);

                    if (!dropStatus.skip) {
                        if (categorySeen[drop.type] === undefined) {
                            categorySeen[drop.type] = {};
                        }
                        if (mapSeen[drop.type] === undefined) {
                            mapSeen[drop.type] = {};
                        }

                        const seenId =
                            drop.type === RewardType.Achievement ? drop.subType : drop.id;

                        const totalInc = dropStatus.setNeed || 1;
                        const haveInc = dropStatus.setHave || 1;
                        const special = drop.type === RewardType.SetSpecial;

                        overallCounts.total += totalInc;
                        if (categorySeen[drop.type][seenId] === undefined || special) {
                            categoryCounts.total += totalInc;
                        }
                        if (mapSeen[drop.type][seenId] === undefined || special) {
                            mapCounts.total += totalInc;
                            mapTypeCounts[fixedType].total += totalInc;
                        }

                        if (!dropStatus.need) {
                            overallCounts.have += haveInc;
                            if (categorySeen[drop.type][seenId] === undefined || special) {
                                categoryCounts.have += haveInc;
                            }
                            if (mapSeen[drop.type][seenId] === undefined || special) {
                                mapCounts.have += haveInc;
                                mapTypeCounts[fixedType].have += haveInc;
                            }
                        }

                        categorySeen[drop.type][seenId] = true;
                        mapSeen[drop.type][seenId] = true;
                    }

                    if (dropStatus.need && !dropStatus.skip) {
                        // Filter for class mask
                        if (drop.classMask > 0) {
                            dropCharacters = dropCharacters.filter(
                                (c) =>
                                    (drop.classMask & classMask) > 0 &&
                                    (drop.classMask &
                                        wowthingData.static.characterClassById.get(c.classId)
                                            .mask) >
                                        0
                            );
                        }

                        if (drop.limit?.length > 0) {
                            switch (drop.limit[0]) {
                                case 'armor':
                                    dropCharacters = dropCharacters.filter(
                                        (c) =>
                                            classByArmorTypeString[drop.limit[1]].indexOf(
                                                c.classId
                                            ) >= 0
                                    );
                                    break;

                                case 'class':
                                    dropCharacters = dropCharacters.filter((c) =>
                                        drop.limit
                                            .slice(1)
                                            .some(
                                                (classSlug) =>
                                                    wowthingData.static.characterClassBySlug.get(
                                                        classSlug
                                                    ).id === c.classId
                                            )
                                    );
                                    break;

                                case 'covenant':
                                    dropCharacters = dropCharacters.filter(
                                        (c) =>
                                            c.shadowlands?.covenantId ===
                                            covenantSlugMap[drop.limit[1]].id
                                    );
                                    break;

                                case 'faction':
                                    dropCharacters = dropCharacters.filter(
                                        (c) => c.faction === factionMap[drop.limit[1]]
                                    );
                                    break;

                                case 'profession': {
                                    const professionId = wowthingData.static.professionBySlug.get(
                                        drop.limit[1]
                                    )?.id;
                                    let subProfessionId = 0;
                                    if (drop.limit.length === 4) {
                                        if (drop.limit[2].match(/^\d+$/)) {
                                            subProfessionId = parseInt(drop.limit[2]);
                                        } else {
                                            const expansion = expansionShortNameMap[drop.limit[2]];
                                            subProfessionId =
                                                wowthingData.static.professionById.get(professionId)
                                                    .expansionSubProfession[expansion.id].id;
                                        }
                                    }

                                    dropCharacters = dropCharacters.filter(
                                        (c) =>
                                            !!c.professions?.[professionId] &&
                                            (subProfessionId
                                                ? c.professions[professionId]?.subProfessions?.[
                                                      subProfessionId
                                                  ]?.skillCurrent >= parseInt(drop.limit[3])
                                                : true)
                                    );
                                    break;
                                }
                                case 'race':
                                    dropCharacters = dropCharacters.filter((c) =>
                                        drop.limit
                                            .slice(1)
                                            .some(
                                                (raceSlug) =>
                                                    wowthingData.static.characterRaceBySlug.get(
                                                        raceSlug
                                                    ).id === c.raceId
                                            )
                                    );
                                    break;
                            }
                        }

                        // Filter again for pre-req quests
                        if (drop.requiredQuestId > 0) {
                            dropCharacters = dropCharacters.filter((c) =>
                                userState.quests.characterById
                                    .get(c.id)
                                    ?.hasQuestById?.has(drop.requiredQuestId)
                            );
                        }

                        // Filter again for characters that haven't completed the quest
                        if (drop.type === RewardType.Quest) {
                            dropCharacters = dropCharacters.filter(
                                (c) =>
                                    !userState.quests.characterById
                                        .get(c.id)
                                        ?.hasQuestById?.has(drop.id)
                            );

                            if (!dropStatus.skip && dropCharacters.length === 0) {
                                dropStatus.need = false;
                            }
                        }

                        if (drop.type === RewardType.XpQuest) {
                            dropCharacters = dropCharacters.filter((c) => !c.isMaxLevel);

                            if (!dropStatus.skip && dropCharacters.length === 0) {
                                dropStatus.need = false;
                            }
                        }

                        dropStatus.validCharacters = dropCharacters.length > 0;

                        // And finally, filter for characters that aren't locked
                        if (drop.questIds) {
                            dropCharacters = dropCharacters.filter(
                                (c) =>
                                    expiredFunc(c.id) ||
                                    drop.questIds.every(
                                        (q) =>
                                            !userState.quests.characterById
                                                .get(c.id)
                                                ?.hasQuestById?.has(q)
                                    )
                            );
                        }

                        for (const character of dropCharacters) {
                            const charQuests = userState.quests.characterById.get(character.id);
                            if (farm.type === FarmType.Quest) {
                                if (farm.questIds.every((q) => !charQuests?.hasQuestById?.has(q))) {
                                    dropStatus.characterIds.push(character.id);
                                } else {
                                    dropStatus.completedCharacterIds.push(character.id);
                                }
                            } else if (drop.type === RewardType.CharacterTrackingQuest) {
                                if (!charQuests?.hasQuestById?.has(drop.id)) {
                                    dropStatus.characterIds.push(character.id);
                                } else {
                                    dropStatus.completedCharacterIds.push(character.id);
                                }
                            } else if (
                                drop.type === RewardType.Item &&
                                wowthingData.static.professionAbilityByItemId.has(drop.id)
                            ) {
                                const professionInfo =
                                    wowthingData.static.professionAbilityByItemId.get(drop.id);
                                if (!character.knowsProfessionAbility(professionInfo.abilityId)) {
                                    dropStatus.characterIds.push(character.id);
                                } else {
                                    // dropStatus.completedCharacterIds.push(character.id)
                                }
                                dropStatus.need = dropStatus.characterIds.length > 0;
                            } else if (drop.type === RewardType.XpQuest) {
                                if (!charQuests?.hasQuestById?.has(drop.id)) {
                                    dropStatus.characterIds.push(character.id);
                                } else {
                                    dropStatus.completedCharacterIds.push(character.id);
                                }
                            } else if (farm.criteriaId) {
                                // FIXME: ugh criteria
                                // const hasCriteria =
                                //     (
                                //         stores.userAchievementData.criteria[farm.criteriaId] || []
                                //     ).filter(([charId]) => charId === character.id).length > 0;
                                // if (!hasCriteria) {
                                dropStatus.characterIds.push(character.id);
                                // } else {
                                //     dropStatus.completedCharacterIds.push(character.id);
                                // }
                            } else {
                                if (
                                    expiredFunc(character.id) ||
                                    farm.questIds.every(
                                        (q) =>
                                            !charQuests?.hasQuestById?.has(q) &&
                                            character.lockouts?.[`${questToLockout[q] || 0}-0`] ===
                                                undefined
                                    )
                                ) {
                                    dropStatus.characterIds.push(character.id);
                                } else {
                                    dropStatus.completedCharacterIds.push(character.id);
                                }
                            }
                        }

                        /*dropStatus.characterIds = filter(
                            dropCharacters,
                            (c) => resetMap[c.id] < now ||
                                every(farm.questIds, (q) => userQuestData.characters[c.id]?.dailyQuests?.get(q) === undefined)
                        ).map(c => c.id)*/

                        // We don't really need it if no characters are on the list
                        // - ok we kinda do so we can see unfinished things
                        //if (dropStatus.characterIds.length === 0) {
                        //    dropStatus.need = false
                        //}
                    }

                    farmStatus.drops.push(dropStatus);
                } // for drop of farm.drops

                farmStatus.need = farmStatus.drops.some((d) => d.need && !d.skip);
                if (
                    farmStatus.need &&
                    farm.type !== FarmType.Vendor &&
                    (farm.reset === FarmResetType.Never || farm.reset === FarmResetType.None)
                ) {
                    farmStatus.need = farmStatus.drops.some((d) => d.characterIds.length > 0);
                }

                const characterIds: Record<number, RewardType[]> = {};

                for (let dropIndex = 0; dropIndex < farmStatus.drops.length; dropIndex++) {
                    const dropStatus = farmStatus.drops[dropIndex];
                    for (const characterId of dropStatus.characterIds) {
                        if (characterIds[characterId] === undefined) {
                            characterIds[characterId] = [];
                        }
                        characterIds[characterId].push(farm.drops[dropIndex].type);
                    }
                }

                farmStatus.characters = Object.entries(characterIds).map((p) => ({
                    id: parseInt(p[0]),
                    types: uniq(p[1]),
                }));

                farmStatuses.push(farmStatus);
            }

            farmData[mapKey] = farmStatuses;
        } // category of categories.slice(1)
    } // categories of zoneMapData.sets

    console.timeEnd('LazyState.doZoneMaps');

    return {
        counts: setCounts,
        farmStatus: farmData,
        typeCounts,
    };
}
