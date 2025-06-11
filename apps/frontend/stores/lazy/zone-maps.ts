import uniq from 'lodash/uniq';
import { DateTime } from 'luxon';

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
import { wowthingData } from '@/shared/stores/data';
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

import type { ZoneMapState } from '../local-storage';
import type { Settings } from '@/shared/stores/settings/types';
import type { UserAchievementData, UserData } from '@/types';
import type { UserQuestData } from '@/types/data';
import type { DropStatus, FarmStatus } from '@/types/zone-maps';

type classMaskStrings = keyof typeof PlayableClassMask;

interface LazyStores {
    settings: Settings;
    zoneMapState: ZoneMapState;
    userData: UserData;
    userAchievementData: UserAchievementData;
    userQuestData: UserQuestData;
}

export interface LazyZoneMaps {
    counts: Record<string, UserCount>;
    farmStatus: Record<string, FarmStatus[]>;
    typeCounts: Record<string, Record<RewardType, UserCount>>;
}

export function doZoneMaps(stores: LazyStores): LazyZoneMaps {
    console.time('LazyStore.doZoneMaps');

    const classMask = getTransmogClassMask(stores.settings);
    const completionistMode = stores.settings.transmog.completionistMode;
    const now = DateTime.utc();

    const farmData: Record<string, FarmStatus[]> = {};
    const setCounts: Record<string, UserCount> = {};
    const typeCounts: Record<string, Record<number, UserCount>> = {};

    const shownCharacters = stores.userData.characters.filter(
        (c) =>
            stores.settings.characters.hiddenCharacters.indexOf(c.id) === -1 &&
            stores.settings.characters.ignoredCharacters.indexOf(c.id) === -1 &&
            (!stores.settings.characters.hideDisabledAccounts ||
                stores.settings.accounts?.[c.accountId]?.enabled !== false)
    );
    const overallCounts = (setCounts['OVERALL'] = new UserCount());
    const resetMap = Object.fromEntries(
        Object.entries(stores.userQuestData.characters).map((c) => [
            c[0],
            {
                daily: getNextDailyReset(
                    c[1].scannedAt,
                    stores.userData.characterMap[parseInt(c[0])]?.realm?.region ?? 1
                ),
                biWeekly: getNextBiWeeklyReset(
                    c[1].scannedAt,
                    stores.userData.characterMap[parseInt(c[0])]?.realm?.region ?? 1
                ),
                weekly: getNextWeeklyReset(
                    c[1].scannedAt,
                    stores.userData.characterMap[parseInt(c[0])]?.realm?.region ?? 1
                ),
            },
        ])
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
                        stores.userQuestData.characters[char.id]?.quests?.has(questId)
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
            const activeClasses = Object.entries(stores.zoneMapState.classFilters[mapKey] || {})
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
                            stores.userQuestData.characters[char.id]?.quests?.has(questId)
                        )) &&
                    (mapClassMask === 0 ||
                        (mapClassMask &
                            wowthingData.static.characterClassById.get(char.classId).mask) >
                            0) &&
                    (stores.zoneMapState.maxLevelOnly === false ||
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
                            stores.userQuestData.characters[c.id]?.quests?.has(q)
                        )
                    );
                }
                if (farm.faction) {
                    farmCharacters = farmCharacters.filter(
                        (c) => c.faction === factionMap[farm.faction]
                    );
                }

                for (const drop of farm.drops) {
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
                                dropStatus.need = !stores.userQuestData.accountHas.has(
                                    wowthingData.manual.dragonridingItemToQuest.get(drop.id)
                                );
                            } else if (wowthingData.manual.druidFormItemToQuest.has(drop.id)) {
                                dropStatus.need = !stores.userQuestData.accountHas.has(
                                    wowthingData.manual.druidFormItemToQuest.get(drop.id)
                                );
                            } else if (wowthingData.static.professionAbilityByItemId.has(drop.id)) {
                                const abilityInfo =
                                    wowthingData.static.professionAbilityByItemId.get(drop.id);
                                dropStatus.need = !isRecipeKnown({ abilityInfo });
                            } else if (wowthingData.static.mountByItemId.has(drop.id)) {
                                dropStatus.need =
                                    !stores.userData.hasMount?.[
                                        wowthingData.static.mountByItemId.get(drop.id).id
                                    ];
                            } else if (wowthingData.static.petByItemId.has(drop.id)) {
                                dropStatus.need =
                                    !stores.userData.hasPet?.[
                                        wowthingData.static.petByItemId.get(drop.id).id
                                    ];
                            } else if (wowthingData.static.toyByItemId.has(drop.id)) {
                                dropStatus.need = !stores.userData.hasToy?.[drop.id];
                            } else {
                                dropStatus.need = true;
                            }
                            break;

                        case RewardType.Achievement:
                            if (drop.subType > 0) {
                                if (!stores.userAchievementData.criteria[drop.subType]) {
                                    dropStatus.need = true;
                                }
                            } else {
                                dropStatus.need =
                                    stores.userAchievementData.achievements[drop.id] === undefined;
                            }
                            break;

                        case RewardType.Currency:
                        case RewardType.Reputation:
                            dropStatus.need = true;
                            break;

                        case RewardType.Mount:
                            if (!stores.userData.hasMount?.[drop.id]) {
                                dropStatus.need = true;
                            }
                            break;

                        case RewardType.Pet:
                            if (!stores.userData.hasPet?.[drop.id]) {
                                dropStatus.need = true;
                            }
                            break;

                        case RewardType.Quest:
                        case RewardType.CharacterTrackingQuest:
                            if (
                                !Object.values(stores.userQuestData.characters).every((char) =>
                                    char?.quests?.has(drop.id)
                                )
                            ) {
                                dropStatus.need = true;
                            }
                            break;

                        case RewardType.Toy:
                            if (!stores.userData.hasToy?.[drop.id]) {
                                dropStatus.need = true;
                            }
                            break;

                        case RewardType.XpQuest:
                            if (
                                !Object.values(stores.userData.characters).every(
                                    (char) =>
                                        char.isMaxLevel ||
                                        !!stores.userQuestData.characters[
                                            char.id
                                        ]?.dailyQuests?.has(drop.id) ||
                                        !!stores.userQuestData.characters[char.id]?.quests?.has(
                                            drop.id
                                        )
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
                                        !stores.userData.hasAppearance.has(appearanceId)
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
                                    ? !stores.userData.hasSourceV2.get(modifier).has(drop.id)
                                    : !stores.userData.hasAppearance.has(
                                          itemAppearances[modifier]?.appearanceId || 0
                                      );
                            }
                            fixedType = RewardType.Transmog;
                            break;

                        case RewardType.Illusion:
                            dropStatus.need = stores.userData.hasIllusion.has(
                                drop.appearanceIds[0][0]
                            );
                            break;

                        case RewardType.SetSpecial:
                            [dropStatus.setHave, dropStatus.setNeed] = getVendorDropStats(
                                stores.settings,
                                completionistMode,
                                drop
                            );
                            dropStatus.need = dropStatus.setHave < dropStatus.setNeed;

                            dropStatus.setNote = getSetCurrencyCostsString(
                                drop.appearanceIds,
                                drop.costs,
                                (appearanceId) => stores.userData.hasAppearance.has(appearanceId)
                            );

                            break;
                    }

                    dropStatus.skip =
                        (farm.type === FarmType.Achievement &&
                            !stores.zoneMapState.trackAchievements) ||
                        (farm.type === FarmType.Quest && !stores.zoneMapState.trackQuests) ||
                        (farm.type === FarmType.Vendor && !stores.zoneMapState.trackVendors) ||
                        (drop.type === RewardType.Achievement &&
                            !stores.zoneMapState.trackAchievements) ||
                        (drop.type === RewardType.Mount && !stores.zoneMapState.trackMounts) ||
                        (drop.type === RewardType.Pet && !stores.zoneMapState.trackPets) ||
                        ((drop.type === RewardType.Quest ||
                            drop.type === RewardType.XpQuest ||
                            drop.type === RewardType.CharacterTrackingQuest) &&
                            !stores.zoneMapState.trackQuests) ||
                        (drop.type === RewardType.Toy && !stores.zoneMapState.trackToys) ||
                        (transmogTypes.has(drop.type) && !stores.zoneMapState.trackTransmog);

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
                                                ? c.professions[professionId][subProfessionId]
                                                      ?.currentSkill >= parseInt(drop.limit[3])
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
                                stores.userQuestData.characters[c.id]?.quests?.has(
                                    drop.requiredQuestId
                                )
                            );
                        }

                        // Filter again for characters that haven't completed the quest
                        if (drop.type === RewardType.Quest) {
                            dropCharacters = dropCharacters.filter(
                                (c) => !stores.userQuestData.characters[c.id]?.quests?.has(drop.id)
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
                                            !stores.userQuestData.characters[
                                                c.id
                                            ]?.dailyQuests?.has(q)
                                    )
                            );
                        }

                        for (const character of dropCharacters) {
                            const charQuests = stores.userQuestData.characters[character.id];
                            if (farm.type === FarmType.Quest) {
                                if (farm.questIds.every((q) => !charQuests?.quests?.has(q))) {
                                    dropStatus.characterIds.push(character.id);
                                } else {
                                    dropStatus.completedCharacterIds.push(character.id);
                                }
                            } else if (drop.type === RewardType.CharacterTrackingQuest) {
                                if (!charQuests?.quests?.has(drop.id)) {
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
                                if (
                                    !charQuests?.dailyQuests?.has(drop.id) &&
                                    !charQuests?.quests?.has(drop.id)
                                ) {
                                    dropStatus.characterIds.push(character.id);
                                } else {
                                    dropStatus.completedCharacterIds.push(character.id);
                                }
                            } else if (farm.criteriaId) {
                                const hasCriteria =
                                    (
                                        stores.userAchievementData.criteria[farm.criteriaId] || []
                                    ).filter(([charId]) => charId === character.id).length > 0;
                                if (!hasCriteria) {
                                    dropStatus.characterIds.push(character.id);
                                } else {
                                    dropStatus.completedCharacterIds.push(character.id);
                                }
                            } else {
                                if (
                                    expiredFunc(character.id) ||
                                    farm.questIds.every(
                                        (q) =>
                                            !charQuests?.dailyQuests?.has(q) &&
                                            !charQuests?.quests?.has(q) &&
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

    console.timeEnd('LazyStore.doZoneMaps');

    return {
        counts: setCounts,
        farmStatus: farmData,
        typeCounts,
    };
}
