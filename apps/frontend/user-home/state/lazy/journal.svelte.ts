import sortBy from 'lodash/sortBy';
import { get } from 'svelte/store';

import { classMaskOrderMap } from '@/data/character-class';
import { journalDifficultyMap } from '@/data/difficulty';
import { slotOrderMap } from '@/data/inventory-slot';
import { professionOrderMap } from '@/data/professions';
import { BindType } from '@/enums/bind-type';
import { playableClasses, PlayableClassMask } from '@/enums/playable-class';
import { RewardType } from '@/enums/reward-type';
import { wowthingData } from '@/shared/stores/data';
import { UserCount } from '@/types';
import { leftPad } from '@/utils/formatting';
import getFilteredItems from '@/utils/journal/get-filtered-items';
import { isRecipeKnown } from '@/utils/professions/is-recipe-known';
import { JournalDataEncounterItem } from '@/types/data';
import { settingsState } from '@/shared/state/settings.svelte';
import { journalState } from '@/stores/local-storage/journal';
import { userState } from '../user';

export interface LazyJournal {
    filteredItems: Record<string, JournalDataEncounterItem[]>;
    stats: Record<string, UserCount>;
}

export function doJournal(): LazyJournal {
    console.time('LazyState.doJournal');

    const ret: LazyJournal = {
        filteredItems: {},
        stats: {},
    };

    const hasAppearanceById = $state.snapshot(userState.general.hasAppearanceById);
    const hasAppearanceBySource = $state.snapshot(userState.general.hasAppearanceBySource);

    const journalStateValue = get(journalState);

    const classMask = settingsState.transmogClassMask;
    const masochist = settingsState.value.transmog.completionistMode;

    const overallStats = (ret.stats['OVERALL'] = new UserCount());
    const overallDungeonStats = (ret.stats['dungeons'] = new UserCount());
    const overallRaidStats = (ret.stats['raids'] = new UserCount());
    const overallSeen = new Set<string>();

    for (const tier of wowthingData.journal.tiers.filter(
        (tier) => tier !== null && tier.slug !== 'dungeons' && tier.slug !== 'raids'
    )) {
        const tierStats = (ret.stats[tier.slug] = new UserCount());
        const tierSeen = new Set<string>();

        const tierDungeonStats = (ret.stats[`dungeons--${tier.slug}`] = new UserCount());
        const tierRaidStats = (ret.stats[`raids--${tier.slug}`] = new UserCount());

        for (const instance of tier.instances.filter((instance) => instance !== null)) {
            const overallStats2 = instance.isRaid ? overallRaidStats : overallDungeonStats;
            const tierStats2 = instance.isRaid ? tierRaidStats : tierDungeonStats;

            const instanceKey = `${tier.slug}--${instance.slug}`;
            const instanceStats = (ret.stats[instanceKey] = new UserCount());
            const instanceSeen = new Set<string>();

            const instanceExpansion =
                wowthingData.static.instanceById.get(instance.id)?.expansion ?? 0;

            for (const encounter of instance.encounters) {
                // Chi-Ji, The Red Crane -> The August Celestials
                if (encounter.id === 857) {
                    encounter.name = wowthingData.static.reputationById.get(1341).name;
                }

                const encounterKey = `${instanceKey}--${encounter.name}`;
                const encounterStats = (ret.stats[encounterKey] = new UserCount());
                const encounterSeen = new Set<string>();

                // FIXME: journal state -> browser state
                if (!journalStateValue.showTrash && encounter.name === 'Trash Drops') {
                    continue;
                }

                for (const group of encounter.groups) {
                    const groupKey = `${encounterKey}--${group.name}`;
                    const groupStats = (ret.stats[groupKey] = new UserCount());
                    const groupSeen = new Set<string>();

                    let filteredItems = getFilteredItems(
                        journalStateValue,
                        group,
                        classMask,
                        instanceExpansion
                    );

                    if (!masochist) {
                        const keepItems: JournalDataEncounterItem[] = [];

                        // Group items by appearanceId
                        const appearanceMap: Record<number, JournalDataEncounterItem[]> = {};
                        for (const item of filteredItems) {
                            if (item.type === RewardType.Item) {
                                for (const appearance of item.appearances) {
                                    (appearanceMap[appearance.appearanceId] ||= []).push(item);
                                }
                            } else {
                                keepItems.push(item);
                            }
                        }

                        const usedItems = new Set<number>();
                        for (const [appearanceIdStr, appearanceItems] of Object.entries(
                            appearanceMap
                        )) {
                            const appearanceId = parseInt(appearanceIdStr);

                            const difficulties = new Set<number>();
                            let itemId = 0;
                            for (const item of appearanceItems) {
                                for (const appearance of item.appearances) {
                                    if (appearance.appearanceId === appearanceId) {
                                        for (const difficulty of appearance.difficulties) {
                                            difficulties.add(difficulty);
                                        }
                                        break;
                                    }
                                }

                                if (itemId === 0 && !usedItems.has(item.id)) {
                                    itemId = item.id;
                                    usedItems.add(item.id);
                                }
                            }

                            const item = new JournalDataEncounterItem(
                                appearanceItems[0].type,
                                itemId || appearanceItems[0].id,
                                Math.max(...appearanceItems.map((item) => item.quality)),
                                appearanceItems[0].classId,
                                appearanceItems[0].subclassId,
                                appearanceItems.reduce((a, b) => a | b.classMask, 0),
                                [
                                    [
                                        appearanceId,
                                        appearanceItems[0].appearances.filter(
                                            (a) => a.appearanceId === appearanceId
                                        )[0].modifierId,
                                        sortBy(
                                            Array.from(difficulties.values()),
                                            (diff) => journalDifficultyMap[diff]
                                        ),
                                    ],
                                ]
                            );
                            item.extraAppearances = appearanceItems.length - 1;

                            keepItems.push(item);
                        }

                        const groupIndices: Record<number, string> = {};
                        for (
                            let groupItemIndex = 0;
                            groupItemIndex < group.items.length;
                            groupItemIndex++
                        ) {
                            const groupItem = group.items[groupItemIndex];
                            groupIndices[groupItem.id] ||= leftPad(groupItemIndex, 3, '0');
                        }

                        filteredItems =
                            keepItems.length === 1
                                ? keepItems
                                : sortBy(
                                      keepItems,
                                      (item) =>
                                          `${groupIndices[item.id]}|${journalDifficultyMap[item.appearances[0].difficulties[0]]}`
                                  );
                    }

                    for (const item of filteredItems) {
                        let allCollected = true;

                        for (const appearance of item.appearances) {
                            let appearanceKey: string;
                            let oppositeKey: string;

                            if (item.type === RewardType.Item) {
                                const actualItem = wowthingData.items.items[item.id];

                                // Check for source first, we're done if they have it
                                appearanceKey = `${item.id}_${appearance.modifierId}`;
                                if (actualItem?.oppositeFactionId) {
                                    oppositeKey = `${actualItem.oppositeFactionId}_${appearance.modifierId}`;
                                }

                                appearance.userHas = hasAppearanceBySource.has(
                                    item.id * 1000 + appearance.modifierId
                                );

                                if (
                                    !masochist &&
                                    !appearance.userHas &&
                                    hasAppearanceById.has(appearance.appearanceId)
                                ) {
                                    // Make sure that the class mask of this item is actually collected
                                    // FIXME: appearanceMask
                                    appearance.userHas = item.classMask === 0; /*||
                                        (userState.general.appearanceMask.get(
                                            appearance.appearanceId
                                        ) &
                                            item.classMask) ===
                                            item.classMask;*/

                                    appearanceKey = appearance.appearanceId.toString();
                                }
                            } else {
                                appearanceKey = `z-${item.type}-${item.id}`;

                                if (item.type === RewardType.Illusion) {
                                    const enchantmentId = wowthingData.static.illusionById.get(
                                        item.appearances[0].appearanceId
                                    ).enchantmentId;
                                    appearance.userHas =
                                        userState.general.hasIllusionByEnchantmentId.has(
                                            enchantmentId
                                        );
                                } else if (item.type === RewardType.Recipe) {
                                    appearance.userHas = isRecipeKnown({ itemId: item.id });
                                } else if (item.type === RewardType.Mount) {
                                    appearance.userHas = userState.general.hasMountById.has(
                                        item.classId
                                    );
                                } else if (item.type === RewardType.Pet) {
                                    appearance.userHas = userState.general.hasPetById.has(
                                        item.classId
                                    );
                                } else if (item.type === RewardType.Toy) {
                                    appearance.userHas = userState.general.hasToyByItemId.has(
                                        item.id
                                    );
                                } else if (item.type === RewardType.Quest) {
                                    appearance.userHas = userState.quests.accountHasById.has(
                                        item.id
                                    );
                                }
                            }

                            if (!appearance.userHas) {
                                allCollected = false;
                            }

                            const overallSeenHas = overallSeen.has(appearanceKey);
                            const tierSeenHas = tierSeen.has(appearanceKey);
                            const instanceSeenHas = instanceSeen.has(appearanceKey);
                            const encounterSeenHas = encounterSeen.has(appearanceKey);
                            const groupSeenHas = groupSeen.has(appearanceKey);

                            if (!overallSeenHas) {
                                overallStats.total++;
                                overallStats2.total++;
                                overallSeen.add(appearanceKey);
                                if (oppositeKey) {
                                    overallSeen.add(oppositeKey);
                                }
                            }
                            if (!tierSeenHas) {
                                tierStats.total++;
                                tierStats2.total++;
                                tierSeen.add(appearanceKey);
                                if (oppositeKey) {
                                    tierSeen.add(oppositeKey);
                                }
                            }
                            if (!instanceSeenHas) {
                                instanceStats.total++;
                                instanceSeen.add(appearanceKey);
                                if (oppositeKey) {
                                    instanceSeen.add(oppositeKey);
                                }
                            }
                            if (!encounterSeenHas) {
                                encounterStats.total++;
                                encounterSeen.add(appearanceKey);
                                if (oppositeKey) {
                                    encounterSeen.add(oppositeKey);
                                }
                            }
                            if (!groupSeenHas) {
                                groupStats.total++;
                                groupSeen.add(appearanceKey);
                                if (oppositeKey) {
                                    groupSeen.add(oppositeKey);
                                }
                            }

                            if (appearance.userHas) {
                                if (!overallSeenHas) {
                                    overallStats.have++;
                                    overallStats2.have++;
                                }
                                if (!tierSeenHas) {
                                    tierStats.have++;
                                    tierStats2.have++;
                                }
                                if (!instanceSeenHas) {
                                    instanceStats.have++;
                                }
                                if (!encounterSeenHas) {
                                    encounterStats.have++;
                                }
                                if (!groupSeenHas) {
                                    groupStats.have++;
                                }
                            }

                            for (const difficulty of appearance.difficulties) {
                                const instanceDifficultyKey = `${instanceKey}--${difficulty}`;
                                const instanceDifficultyStats = (ret.stats[
                                    instanceDifficultyKey
                                ] ||= new UserCount());

                                const encounterDifficultyKey = `${encounterKey}--${difficulty}`;
                                const encounterDifficultyStats = (ret.stats[
                                    encounterDifficultyKey
                                ] ||= new UserCount());

                                const itemKey = `${appearanceKey}--${difficulty}`;

                                if (!instanceSeen.has(itemKey)) {
                                    instanceDifficultyStats.total++;
                                    if (appearance.userHas) {
                                        instanceDifficultyStats.have++;
                                    }
                                    instanceSeen.add(itemKey);
                                }

                                if (!encounterSeen.has(itemKey)) {
                                    encounterDifficultyStats.total++;
                                    if (appearance.userHas) {
                                        encounterDifficultyStats.have++;
                                    }
                                    encounterSeen.add(itemKey);
                                }
                            }
                        }

                        if (!allCollected) {
                            for (const [className, classMask] of playableClasses) {
                                if (item.classMask === 0 || (item.classMask & classMask) > 0) {
                                    const classInstanceKey = `${instanceKey}--class:${className}`;
                                    const classInstanceStats = (ret.stats[classInstanceKey] ||=
                                        new UserCount());
                                    classInstanceStats.total++;

                                    const classEncounterKey = `${instanceKey}--${encounter.name}--class:${className}`;
                                    const classEncounterStats = (ret.stats[classEncounterKey] ||=
                                        new UserCount());
                                    classEncounterStats.total++;
                                }
                            }
                        }

                        if (
                            (journalStateValue.showUncollected && !allCollected) ||
                            (journalStateValue.showCollected && allCollected)
                        ) {
                            item.show = true;
                        }
                    } // item of filteredItems

                    const recipeOrder: Record<number, number> = {};
                    filteredItems.sort((a, b) => {
                        // If the final class mask is exactly one character, sort those last
                        const aClassSpecific = a.classMask in PlayableClassMask;
                        const bClassSpecific = b.classMask in PlayableClassMask;
                        if (aClassSpecific && !bClassSpecific) {
                            return 1;
                        } else if (!aClassSpecific && bClassSpecific) {
                            return -1;
                        } else if (aClassSpecific && bClassSpecific) {
                            const diff =
                                classMaskOrderMap[a.classMask] - classMaskOrderMap[b.classMask];
                            if (diff !== 0) {
                                return diff;
                            }
                        }

                        const aItem = wowthingData.items.items[a.id];
                        const bItem = wowthingData.items.items[b.id];

                        // Sort by faction
                        const aFaction = aItem.allianceOnly ? 1 : aItem.hordeOnly ? 2 : 0;
                        const bFaction = bItem.allianceOnly ? 1 : bItem.hordeOnly ? 2 : 0;
                        if (aFaction != bFaction) {
                            return aFaction - bFaction;
                        }

                        if (group.name === 'Recipe') {
                            let aOrder = recipeOrder[a.id];
                            if (!aOrder) {
                                const aSkillLine = wowthingData.static.itemToSkillLine[a.id];
                                const [aProfession] =
                                    wowthingData.static.professionBySkillLineId.get(aSkillLine[0]);
                                aOrder = recipeOrder[a.id] = professionOrderMap[aProfession?.id];
                            }

                            let bOrder = recipeOrder[b.id];
                            if (!bOrder) {
                                const bSkillLine = wowthingData.static.itemToSkillLine[b.id];
                                const [bProfession] =
                                    wowthingData.static.professionBySkillLineId.get(bSkillLine[0]);
                                bOrder = recipeOrder[b.id] = professionOrderMap[bProfession?.id];
                            }

                            if (aOrder !== bOrder) {
                                return aOrder - bOrder;
                            }

                            const aBound = aItem.bindType === BindType.NotBound ? 0 : 1;
                            const bBound = bItem.bindType === BindType.NotBound ? 0 : 1;
                            if (aBound !== bBound) {
                                return aBound - bBound;
                            }
                        }

                        // Sort by item slot
                        const aSlotOrder = slotOrderMap[aItem.inventoryType] || 999;
                        const bSlotOrder = slotOrderMap[bItem.inventoryType] || 999;
                        if (aSlotOrder !== bSlotOrder) {
                            return aSlotOrder - bSlotOrder;
                        }

                        // Sort by the difficulty if exactly one appearance
                        if (a.appearances?.length === 1 && b.appearances?.length === 1) {
                            const aDiffs = a.appearances[0].difficulties;
                            const bDiffs = b.appearances[0].difficulties;

                            if (aDiffs.length === 1 && bDiffs.length === 1) {
                                const aValue = uhh[aDiffs[0]] || 999;
                                const bValue = uhh[bDiffs[0]] || 999;
                                return aValue - bValue;
                            }
                        }

                        return 0;
                    });

                    ret.filteredItems[groupKey] = filteredItems;
                    //group.filteredItems = filteredItems
                } //group
            } // encounter
        } // instance
    } // tier

    console.timeEnd('LazyState.doJournal');

    return ret;
}

const uhh: Record<number, number> = {
    3: 1,
    5: 2,
    4: 3,
    6: 4,
};
