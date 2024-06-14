import some from 'lodash/some';

import { InventoryType, weaponInventoryTypes } from '@/enums/inventory-type';
import { UserCount, type UserAchievementData, type UserData } from '@/types';
import getSkipClasses from '@/utils/get-skip-classes';
import type { StaticData } from '@/shared/stores/static/types';
import type { ItemData } from '@/types/data/item';
import type { ManualData, ManualDataTransmogCategory } from '@/types/data/manual';
import type { Settings } from '@/shared/stores/settings/types';
import type { UserQuestData } from '@/types/data';

export type TransmogSlotData = Record<number, [boolean, [boolean, number, number][]?]>;

export interface LazyTransmog {
    filteredCategories: ManualDataTransmogCategory[][];
    skip: Set<string>;
    slots: Record<string, TransmogSlotData>;
    stats: Record<string, UserCount>;
}

interface LazyStores {
    settings: Settings;
    itemData: ItemData;
    manualData: ManualData;
    staticData: StaticData;
    userAchievementData: UserAchievementData;
    userData: UserData;
    userQuestData: UserQuestData;
}

export function doTransmog(stores: LazyStores): LazyTransmog {
    console.time('LazyStore.doTransmog');

    const ret: LazyTransmog = {
        filteredCategories: [],
        skip: new Set<string>(),
        slots: {},
        stats: {},
    };

    const completionistMode = stores.settings.transmog.completionistMode;
    const completionistSets = completionistMode && stores.settings.transmog.completionistSets;
    const skipAlliance = !stores.settings.transmog.showAllianceOnly;
    const skipHorde = !stores.settings.transmog.showHordeOnly;
    const skipClasses = getSkipClasses(stores.settings);

    const overallSeen: Record<number, boolean> = {};
    const overallStats = (ret.stats['OVERALL'] = new UserCount());

    for (const categories of stores.manualData.transmog.sets) {
        if (categories === null) {
            ret.filteredCategories.push(null);
            continue;
        }

        const baseStats = (ret.stats[categories[0].slug] = new UserCount());

        const newCategories: ManualDataTransmogCategory[] = [];
        for (const category of categories.slice(1)) {
            const catKey = `${categories[0].slug}--${category.slug}`;
            const catStats = (ret.stats[catKey] = new UserCount());

            let keptAny = false;
            for (let groupIndex = 0; groupIndex < category.groups.length; groupIndex++) {
                const group = category.groups[groupIndex];

                const groupKey = `${catKey}--${groupIndex}`;
                const groupStats = (ret.stats[groupKey] ||= new UserCount());

                for (const [dataKey, dataValue] of Object.entries(group.data)) {
                    if (skipClasses[dataKey]) {
                        continue;
                    }

                    for (let setIndex = 0; setIndex < dataValue.length; setIndex++) {
                        const setKey = `${groupKey}--${setIndex}`;
                        const setStats = (ret.stats[setKey] ||= new UserCount());
                        const setName = group.sets[setIndex];

                        const setDataKey = `${setKey}--${dataKey}`;
                        const setDataStats = (ret.stats[setDataKey] ||= new UserCount());

                        // Faction filters
                        if (
                            (skipAlliance && setName.indexOf(':alliance:') >= 0) ||
                            (skipHorde && setName.indexOf(':horde') >= 0)
                        ) {
                            ret.skip.add(setKey);
                            continue;
                        }

                        keptAny = true;

                        // Sets that are explicitly not counted
                        const countUncollected = !setName.endsWith('*');

                        const groupSigh = dataValue[setIndex];
                        if (groupSigh === null) {
                            continue;
                        }

                        let overrideHas = false;
                        if (groupSigh.achievementId) {
                            overrideHas ||=
                                !!stores.userAchievementData.achievements[groupSigh.achievementId];
                        }
                        if (groupSigh.questId) {
                            overrideHas ||= Object.values(stores.userQuestData.characters).some(
                                (charQuests) => charQuests.quests?.has(groupSigh.questId),
                            );
                        }

                        const slotData: TransmogSlotData = (ret.slots[setDataKey] = {});
                        if (groupSigh.transmogSetId) {
                            const transmogSet =
                                stores.staticData.transmogSets[groupSigh.transmogSetId];
                            ret.stats[`transmogSet:${groupSigh.transmogSetId}`] = setDataStats;
                            for (
                                let itemIndex = 0;
                                itemIndex < transmogSet.items.length;
                                itemIndex++
                            ) {
                                const [itemId, maybeModifier] = transmogSet.items[itemIndex];
                                const modifier = maybeModifier || 0;

                                // Dragonflight set mythic looks?
                                if (modifier >= 153 && modifier <= 156) {
                                    continue;
                                }

                                const item = stores.itemData.items[itemId];

                                let actualSlot: number;
                                if (weaponInventoryTypes.has(item.inventoryType)) {
                                    actualSlot = 100 + item.subclassId;
                                } else {
                                    actualSlot =
                                        item.inventoryType === InventoryType.Chest2
                                            ? InventoryType.Chest
                                            : item.inventoryType;
                                }

                                if (
                                    completionistMode &&
                                    !completionistSets &&
                                    !weaponInventoryTypes.has(item.inventoryType) &&
                                    slotData[actualSlot] !== undefined
                                ) {
                                    continue;
                                }

                                // const hasAppearance = stores.userData.hasAppearance.has(appearance.appearanceId)
                                const hasSource =
                                    overrideHas ||
                                    stores.userData.hasSource.has(`${itemId}_${modifier}`);

                                // const userHas = (completionistMode || transmogSet.allianceOnly || transmogSet.hordeOnly)
                                //     ? hasSource : hasAppearance

                                // if (userHas) {
                                //     slotData[actualSlot][0] = true
                                // }

                                slotData[actualSlot] ||= [false, []];

                                slotData[actualSlot][0] ||= hasSource;
                                slotData[actualSlot][1].push([hasSource, itemId, modifier]);
                            }

                            // let setTotal = 0
                            // let setHave = 0

                            if (completionistSets) {
                                setDataStats.total = Object.values(slotData).reduce(
                                    (a, b) => a + b[1].length,
                                    0,
                                );
                                setDataStats.have = Object.values(slotData).reduce(
                                    (a, b) =>
                                        a + b[1].filter((hasSlot) => hasSlot[0] === true).length,
                                    0,
                                );
                            } else {
                                setDataStats.total = Object.values(slotData).length;
                                setDataStats.have = Object.values(slotData).filter(
                                    (has) => has[0] === true,
                                ).length;
                            }

                            if (countUncollected) {
                                overallStats.total += setDataStats.total;
                                overallStats.have += setDataStats.have;

                                baseStats.total += setDataStats.total;
                                baseStats.have += setDataStats.have;

                                catStats.total += setDataStats.total;
                                catStats.have += setDataStats.have;

                                groupStats.total += setDataStats.total;
                                groupStats.have += setDataStats.have;

                                setStats.total += setDataStats.total;
                                setStats.have += setDataStats.have;
                            } else {
                                catStats.total += setDataStats.have;
                                catStats.have += setDataStats.have;

                                groupStats.total += setDataStats.have;
                                groupStats.have += setDataStats.have;

                                setStats.total += setDataStats.have;
                                setStats.have += setDataStats.have;
                            }
                        } else {
                            const slotKeys = Object.keys(groupSigh.items).map((key) =>
                                parseInt(key),
                            );

                            for (const slotKey of slotKeys) {
                                const transmogIds = groupSigh.items[slotKey];

                                const seenAny = some(transmogIds, (id) => overallSeen[id]);

                                if (countUncollected) {
                                    if (!seenAny) {
                                        overallStats.total++;
                                    }
                                    baseStats.total++;
                                    catStats.total++;
                                    groupStats.total++;
                                    setStats.total++;
                                }

                                let haveAny = overrideHas;
                                for (const transmogId of transmogIds) {
                                    haveAny ||= stores.userData.hasAppearance.has(transmogId);

                                    if (haveAny) {
                                        if (countUncollected) {
                                            if (!overallSeen[transmogId]) {
                                                overallStats.have++;
                                            }
                                            baseStats.have++;
                                        } else {
                                            catStats.total++;
                                            groupStats.total++;
                                            setStats.total++;
                                        }

                                        catStats.have++;
                                        groupStats.have++;
                                        setStats.have++;

                                        break;
                                    }
                                }

                                slotData[slotKey] = [haveAny];

                                for (const transmogId of transmogIds) {
                                    overallSeen[transmogId] = true;
                                }
                            }
                        }
                    }
                }
            }

            if (keptAny) {
                newCategories.push(category);
            }
        }

        if (newCategories.length > 0) {
            ret.filteredCategories.push(newCategories);
        }
    }

    console.timeEnd('LazyStore.doTransmog');

    return ret;
}
