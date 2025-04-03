import groupBy from 'lodash/groupBy';

import { weaponInventoryTypes } from '@/enums/inventory-type';
import { ItemQuality } from '@/enums/item-quality';
import { UserCount, type UserAchievementData, type UserData } from '@/types';
import { fixedInventoryType } from '@/utils/fixed-inventory-type';
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
import getSkipClasses from '@/utils/get-skip-classes';
import type { Settings } from '@/shared/stores/settings/types';
import type { StaticData } from '@/shared/stores/static/types';
import type { UserQuestData } from '@/types/data';
import type { ItemData } from '@/types/data/item';
import type { ManualData, ManualDataTransmogCategory } from '@/types/data/manual';

// [hasAny, [hasItem, itemId, modifier, appearanceId]]
export type TransmogSlot = [boolean, number, number, number];
export type TransmogSlotData = Record<number, [boolean, TransmogSlot[]?]>;

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

    const doSlot = (
        slotData: TransmogSlotData,
        itemId: number,
        modifier: number,
        useSource: boolean,
        overrideHas = false,
    ) => {
        // Dragonflight set mythic looks?
        // if (modifier >= 153 && modifier <= 156) {
        //     continue;
        // }

        const item = stores.itemData.items[itemId];
        if (!item) {
            return;
        }

        let actualSlot: number;
        if (weaponInventoryTypes.has(item.inventoryType)) {
            actualSlot = 100 + item.subclassId;
        } else {
            actualSlot = fixedInventoryType(item.inventoryType);
        }

        let appearanceId = item.appearances[modifier]?.appearanceId || 0;
        appearanceId = stores.itemData.appearanceMap[appearanceId] || appearanceId;

        const hasSource =
            overrideHas ||
            (useSource
                ? stores.userData.hasSourceV2.get(modifier).has(itemId)
                : stores.userData.hasAppearance.has(appearanceId));

        slotData[actualSlot] ||= [false, []];
        slotData[actualSlot][0] ||= hasSource;
        slotData[actualSlot][1].push([hasSource, itemId, modifier, appearanceId]);
    };

    const completionistMode = stores.settings.transmog.completionistMode;
    const completionistSets = completionistMode && stores.settings.transmog.completionistSets;
    const skipAlliance = !stores.settings.transmog.showAllianceOnly;
    const skipHorde = !stores.settings.transmog.showHordeOnly;
    const skipClasses = getSkipClasses(stores.settings);

    const overallSeen: Record<string, boolean> = {};
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

                        const groupSigh = dataValue[setIndex];
                        if (groupSigh === null) {
                            continue;
                        }

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

                        // Get itemId/modifier pairs from newer data
                        const itemsWithModifiers: [number, number][] = [];
                        let ensembleStats: UserCount;
                        if (groupSigh.transmogSetId) {
                            ret.stats[`transmogSet:${groupSigh.transmogSetId}`] = setDataStats;
                            ensembleStats = ret.stats[`ensemble:${groupSigh.transmogSetId}`] =
                                new UserCount();

                            const transmogSet =
                                stores.staticData.transmogSets[groupSigh.transmogSetId];

                            for (const [itemId, maybeModifier] of transmogSet.items) {
                                const item = stores.itemData.items[itemId];
                                if (!item) {
                                    continue;
                                }

                                // These don't collect properly
                                if (item.quality === ItemQuality.Heirloom) {
                                    continue;
                                }

                                // Skip items that don't match the transmog set's class mask
                                if (
                                    item.classMask > 0 &&
                                    transmogSet.classMask > 0 &&
                                    (item.classMask & transmogSet.classMask) !==
                                        transmogSet.classMask
                                ) {
                                    continue;
                                }

                                // Skip items that don't match the transmog set's faction
                                if (
                                    (transmogSet.allianceOnly && item.hordeOnly) ||
                                    (transmogSet.hordeOnly && item.allianceOnly)
                                ) {
                                    continue;
                                }

                                const modifier =
                                    groupSigh.transmogSetModifier >= 0
                                        ? groupSigh.transmogSetModifier
                                        : maybeModifier || 0;
                                itemsWithModifiers.push([itemId, modifier]);
                            }
                        } else if (groupSigh.itemsV2.length > 0) {
                            itemsWithModifiers.push(...groupSigh.itemsV2);
                        } else {
                            for (const appearanceIds of Object.values(groupSigh.items)) {
                                for (const appearanceId of appearanceIds) {
                                    itemsWithModifiers.push(
                                        ...(stores.itemData.appearanceToItems[appearanceId] || []),
                                    );
                                }
                            }
                        }

                        if (itemsWithModifiers.length === 0) {
                            console.error('Wacky set', group, groupSigh);
                            continue;
                        }

                        const slotData: TransmogSlotData = (ret.slots[setDataKey] = {});
                        for (const [itemId, modifier] of itemsWithModifiers) {
                            doSlot(slotData, itemId, modifier, completionistMode, overrideHas);
                        }

                        if (completionistSets) {
                            setDataStats.total = Object.values(slotData).reduce(
                                (a, b) => a + b[1].length,
                                0,
                            );
                            setDataStats.have = Object.values(slotData).reduce(
                                (a, b) => a + b[1].filter((hasSlot) => hasSlot[0] === true).length,
                                0,
                            );

                            if (ensembleStats) {
                                ensembleStats.total = setDataStats.total;
                                ensembleStats.have = setDataStats.have;
                            }

                            // [hasSlot, [hasSource, itemId, modifier][]][]
                            for (const itemDatas of Object.values(slotData)) {
                                for (const [hasSource, itemId, modifier] of itemDatas[1]) {
                                    const sourceKey = `${itemId}_${modifier}`;

                                    // unavailable sets can skip?
                                    if (!hasSource && !countUncollected) {
                                        continue;
                                    }

                                    if (!overallSeen[sourceKey]) {
                                        overallStats.total++;
                                    }
                                    baseStats.total++;
                                    catStats.total++;
                                    groupStats.total++;
                                    setStats.total++;

                                    if (hasSource) {
                                        if (!overallSeen[sourceKey]) {
                                            overallStats.have++;
                                        }
                                        baseStats.have++;
                                        catStats.have++;
                                        groupStats.have++;
                                        setStats.have++;
                                    }

                                    overallSeen[sourceKey] = true;
                                }
                            }
                        } else {
                            buildStats(completionistMode, slotData, setDataStats, ensembleStats);

                            catStats.have += setDataStats.have;
                            groupStats.have += setDataStats.have;
                            setStats.have += setDataStats.have;

                            if (countUncollected) {
                                overallStats.total += setDataStats.total;
                                overallStats.have += setDataStats.have;

                                baseStats.total += setDataStats.total;
                                baseStats.have += setDataStats.have;

                                catStats.total += setDataStats.total;
                                groupStats.total += setDataStats.total;
                                setStats.total += setDataStats.total;
                            } else {
                                catStats.total += setDataStats.have;
                                groupStats.total += setDataStats.have;
                                setStats.total += setDataStats.have;
                            }
                        }
                    } // for setIndex
                }
            }

            if (keptAny) {
                newCategories.push(category);
            }
        }

        if (newCategories.length > 0) {
            ret.filteredCategories.push(newCategories);
        }
    } // categories of stores.manualData.transmog.sets

    // generate stats for any transmog sets not seen in manual sets
    for (const [transmogSetId, transmogSet] of getNumberKeyedEntries(
        stores.staticData.transmogSets,
    )) {
        const setKey = `transmogSet:${transmogSetId}`;
        if (ret.stats[setKey]) {
            continue;
        }

        const ensembleStats = (ret.stats[`ensemble:${transmogSetId}`] = new UserCount());
        const setStats = (ret.stats[setKey] = new UserCount());
        const slotData: TransmogSlotData = (ret.slots[setKey] = {});
        for (let itemIndex = 0; itemIndex < transmogSet.items.length; itemIndex++) {
            const [itemId, maybeModifier] = transmogSet.items[itemIndex];
            const modifier = maybeModifier || 0;

            doSlot(slotData, itemId, modifier, completionistMode);
        }

        if (completionistSets) {
            setStats.total = Object.values(slotData).reduce((a, b) => a + b[1].length, 0);
            setStats.have = Object.values(slotData).reduce(
                (a, b) => a + b[1].filter((hasSlot) => hasSlot[0] === true).length,
                0,
            );

            if (ensembleStats) {
                ensembleStats.total = setStats.total;
                ensembleStats.have = setStats.have;
            }
        } else {
            buildStats(completionistMode, slotData, setStats, ensembleStats);
        }
    }

    console.timeEnd('LazyStore.doTransmog');

    return ret;
}

function buildStats(
    completionistMode: boolean,
    slotData: TransmogSlotData,
    setDataStats: UserCount,
    ensembleStats: UserCount,
) {
    if (ensembleStats) {
        if (completionistMode) {
            ensembleStats.total = Object.values(slotData).reduce((a, b) => a + b[1].length, 0);
            ensembleStats.have = Object.values(slotData).reduce(
                (a, b) => a + b[1].filter((hasSlot) => hasSlot[0] === true).length,
                0,
            );
        } else {
            const byAppearanceId = groupBy(
                Object.values(slotData)
                    .flatMap(([, items]) => items)
                    .filter((slot) => slot[3] > 0),
                (slot) => slot[3],
            );

            ensembleStats.total = Object.keys(byAppearanceId).length;

            ensembleStats.have = Object.values(byAppearanceId).filter((combos) =>
                combos.some(([has]) => has),
            ).length;
        }
    }

    const armor = Object.entries(slotData)
        .filter(([key]) => parseInt(key) < 100)
        .map(([, value]) => value);

    const weapons = Object.entries(slotData)
        .filter(([a]) => parseInt(a) >= 100)
        .map(([, b]) => b);
    const weaponsByAppearanceId = groupBy(
        weapons.flatMap(([, items]) => items),
        (slot) => slot[3],
    );

    setDataStats.total = armor.length + Object.keys(weaponsByAppearanceId).length;

    setDataStats.have =
        armor.filter((has) => has[0] === true).length +
        Object.values(weaponsByAppearanceId).filter((combos) => combos.some(([has]) => has)).length;
}
