import { weaponInventoryTypes } from '@/enums/inventory-type';
import { wowthingData } from '@/shared/stores/data';
import { settingsState } from '@/shared/state/settings.svelte';
import { UserCount } from '@/types/user-count';
import { fixedInventoryType } from '@/utils/fixed-inventory-type';
import getSkipClasses from '@/utils/get-skip-classes';
import type { ManualDataTransmogCategory } from '@/types/data/manual/transmog';

import { userState } from '../user';
import { ItemQuality } from '@/enums/item-quality';
import groupBy from 'lodash/groupBy';
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';

// [hasAny, [hasAppearance, hasSource, itemId, modifier, appearanceId]]
export type TransmogSlot = [boolean, boolean, number, number, number];
// [hasAppearance, slots?]
export type TransmogSlotData = Record<number, [boolean, TransmogSlot[]?]>;

export interface LazyTransmog {
    filteredCategories: ManualDataTransmogCategory[][];
    skip: Set<string>;
    slots: Record<string, TransmogSlotData>;
    stats: Record<string, UserCount>;
}

export function doTransmog(): LazyTransmog {
    console.time('LazyState.doTransmog');

    const hasAppearanceById = $state.snapshot(userState.general.hasAppearanceById);
    const hasAppearanceBySource = $state.snapshot(userState.general.hasAppearanceBySource);

    const ret: LazyTransmog = {
        filteredCategories: [],
        skip: new Set<string>(),
        slots: {},
        stats: {},
    };

    const doSlot = (
        slotData: TransmogSlotData,
        maybeItemId: number,
        modifier: number,
        useSource: boolean,
        overrideHas = false
    ) => {
        // Dragonflight set mythic looks?
        // if (modifier >= 153 && modifier <= 156) {
        //     continue;
        // }

        const itemId = maybeItemId % 10_000_000;
        const item = wowthingData.items.items[itemId];
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
        appearanceId = wowthingData.items.appearanceMap[appearanceId] || appearanceId;

        const hasSource = overrideHas || hasAppearanceBySource.has(itemId * 1000 + modifier);
        const hasAppearance = hasSource || overrideHas || hasAppearanceById.has(appearanceId);

        slotData[actualSlot] ||= [false, []];
        slotData[actualSlot][0] ||= completionistMode ? hasSource : hasAppearance;
        slotData[actualSlot][1].push([hasAppearance, hasSource, itemId, modifier, appearanceId]);
    };

    const completionistMode = settingsState.value.transmog.completionistMode;
    const completionistSets = completionistMode && settingsState.value.transmog.completionistSets;
    const skipAlliance = !settingsState.value.transmog.showAllianceOnly;
    const skipHorde = !settingsState.value.transmog.showHordeOnly;
    const skipClasses = getSkipClasses(settingsState.value);

    const overallSeen: Record<string, boolean> = {};
    const overallStats = (ret.stats['OVERALL'] = new UserCount());

    console.time('LazyState.doTransmog.categories');
    for (const categories of wowthingData.manual.transmog.sets) {
        if (categories === null) {
            ret.filteredCategories.push(null);
            continue;
        }

        const baseStats = (ret.stats[categories[0].slug] = new UserCount());

        const newCategories: ManualDataTransmogCategory[] = [];
        // for (const category of categories.slice(1)) {
        for (let categoryIndex = 1; categoryIndex < categories.length; categoryIndex++) {
            const category = categories[categoryIndex];
            const catKey = `${categories[0].slug}--${category.slug}`;
            const catStats = (ret.stats[catKey] = new UserCount());

            let keptAny = false;
            for (let groupIndex = 0; groupIndex < category.groups.length; groupIndex++) {
                const group = category.groups[groupIndex];

                const groupKey = `${catKey}--${groupIndex}`;
                // Multiple consecutive groups with the same name are coalesced into a single
                // display group, make sure the group stats are accurate
                let groupStatsKey = groupKey;
                if (groupIndex > 0) {
                    let priorIndex = groupIndex;
                    while (priorIndex > 0) {
                        priorIndex--;
                        const priorGroup = category.groups[priorIndex];
                        if (priorGroup.name === group.name) {
                            groupStatsKey = `${catKey}--${priorIndex}`;
                        } else {
                            break;
                        }
                    }
                }

                const groupStats = (ret.stats[groupStatsKey] ||= new UserCount());

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
                        // FIXME: user achievement store
                        // if (groupSigh.achievementId) {
                        //     overrideHas ||=
                        //         !!stores.userAchievementData.achievements[groupSigh.achievementId];
                        // }
                        if (groupSigh.questId) {
                            overrideHas ||= Array.from(
                                userState.quests.characterById.values()
                            ).some((charQuests) => charQuests.hasQuestById.has(groupSigh.questId));
                        }

                        // Get itemId/modifier pairs from newer data
                        const itemsWithModifiers: [number, number][] = [];
                        let ensembleStats: UserCount;
                        let manualItems = false;
                        if (groupSigh.transmogSetId) {
                            ret.stats[`transmogSet:${groupSigh.transmogSetId}`] = setDataStats;
                            ensembleStats = ret.stats[`ensemble:${groupSigh.transmogSetId}`] =
                                new UserCount();

                            const transmogSet = wowthingData.static.transmogSetById.get(
                                groupSigh.transmogSetId
                            );
                            if (!transmogSet) {
                                // console.warn('Invalid transmog set ID', groupSigh.transmogSetId);
                                continue;
                            }

                            const anyPrimary = transmogSet.items.some(
                                ([itemId]) => itemId > 10_000_000
                            );

                            for (const [maybeItemId, maybeModifier] of transmogSet.items) {
                                let itemId = maybeItemId;
                                // non-primary items
                                if (
                                    anyPrimary &&
                                    itemId < 10_000_000 &&
                                    completionistMode &&
                                    !completionistSets
                                ) {
                                    continue;
                                }

                                if (itemId > 10_000_000) {
                                    itemId -= 10_000_000;
                                }

                                const item = wowthingData.items.items[itemId];
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
                            manualItems = true;
                            itemsWithModifiers.push(...groupSigh.itemsV2);
                        } else {
                            for (const appearanceIds of Object.values(groupSigh.items)) {
                                for (const appearanceId of appearanceIds) {
                                    itemsWithModifiers.push(
                                        ...(wowthingData.items.appearanceToItems[appearanceId] ||
                                            [])
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

                        const slotDataValues = Object.values(slotData);

                        if (completionistSets || manualItems) {
                            setDataStats.total = slotDataValues.reduce(
                                (a, b) => a + b[1].length,
                                0
                            );
                            setDataStats.have = slotDataValues.reduce(
                                (a, b) => a + b[1].filter((hasSlot) => hasSlot[1] === true).length,
                                0
                            );

                            if (ensembleStats) {
                                ensembleStats.total = setDataStats.total;
                                ensembleStats.have = setDataStats.have;
                            }

                            // [hasSlot, [hasSource, itemId, modifier][]][]
                            for (const itemDatas of slotDataValues) {
                                for (const [, hasSource, itemId, modifier] of itemDatas[1]) {
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
    } // categories of wowthingData.manual.transmog.sets
    console.timeEnd('LazyState.doTransmog.categories');

    // generate stats for any transmog sets not seen in manual sets
    console.time('LazyState.doTransmog.sets');
    for (const [transmogSetId, transmogSet] of wowthingData.static.transmogSetById.entries()) {
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
                (a, b) => a + b[1].filter((hasSlot) => hasSlot[1] === true).length,
                0
            );

            if (ensembleStats) {
                ensembleStats.total = setStats.total;
                ensembleStats.have = setStats.have;
            }
        } else {
            buildStats(completionistMode, slotData, setStats, ensembleStats);
        }
    }
    console.timeEnd('LazyState.doTransmog.sets');

    console.timeEnd('LazyState.doTransmog');

    return ret;
}

function buildStats(
    completionistMode: boolean,
    slotData: TransmogSlotData,
    setDataStats: UserCount,
    ensembleStats: UserCount
) {
    const slotEntries = getNumberKeyedEntries(slotData);

    if (ensembleStats) {
        if (completionistMode) {
            ensembleStats.total = slotEntries.reduce((a, b) => a + b[1][1].length, 0);
            ensembleStats.have = slotEntries.reduce(
                (a, b) => a + b[1][1].filter((hasSlot) => hasSlot[0] === true).length,
                0
            );
        } else {
            const byAppearanceId = groupBy(
                slotEntries.flatMap(([, [, items]]) => items).filter((slot) => slot[4] > 0),
                (slot) => slot[4]
            );

            ensembleStats.total = Object.keys(byAppearanceId).length;

            ensembleStats.have = Object.values(byAppearanceId).filter((combos) =>
                combos.some(([has]) => has)
            ).length;
        }
    }

    const armor = slotEntries.filter(([key]) => key < 100).map(([, value]) => value);
    const weapons = slotEntries.filter(([key]) => key >= 100).map(([, value]) => value);
    const weaponsByAppearanceId = groupBy(
        weapons.flatMap(([, items]) => items),
        (slot) => slot[4]
    );

    setDataStats.total = armor.length + Object.keys(weaponsByAppearanceId).length;

    setDataStats.have =
        armor.filter((has) => has[0] === true).length +
        Object.values(weaponsByAppearanceId).filter((combos) => combos.some(([has]) => has)).length;
}
