import sortBy from 'lodash/sortBy';

import { UserCount, type UserData } from '@/types';
import type { Settings } from '@/shared/stores/settings/types';
import type { StaticData } from '@/shared/stores/static/types';
import type { ItemData } from '@/types/data/item';
import {
    AppearanceDataAppearance,
    AppearanceDataSet,
} from '@/types/data/appearance';
import { expansionMap, expansionSlugMap } from '@/data/expansion';
import { ItemClass } from '@/enums/item-class';
import { leftPad } from '@/utils/formatting';
import { weaponSubclassOrderMap, weaponSubclassToString } from '@/data/weapons';
import { typeOrderMap } from '@/data/inventory-type';
import { ArmorType } from '@/enums/armor-type';
import type { AppearancesState } from '../local-storage';

interface LazyStores {
    appearanceState: AppearancesState;
    settings: Settings;
    itemData: ItemData;
    staticData: StaticData;
    userData: UserData;
}

export interface LazyAppearances {
    appearances: Record<string, AppearanceDataSet[]>;
    stats: Record<string, UserCount>;
}

let appearanceCache: Record<string, AppearanceDataSet[]>;

export function doAppearances(stores: LazyStores): LazyAppearances {
    if (!appearanceCache) {
        buildAppearanceCache(stores);
    }

    const ret: LazyAppearances = {
        appearances: appearanceCache,
        stats: {},
    };

    const overallData = (ret.stats['OVERALL'] = new UserCount());
    const overallSeen: Record<number, boolean> = {};

    for (const [key, sets] of Object.entries(appearanceCache)) {
        const parentData = (ret.stats[key.split('--')[0]] ||= new UserCount());
        const catData = (ret.stats[key] = new UserCount());

        for (const set of sets) {
            const setData = (ret.stats[`${key}--${set.name}`] =
                new UserCount());

            for (const appearance of set.appearances) {
                const quality = appearance.modifiedAppearances[0]?.quality;
                if (stores.appearanceState[`showQuality${quality}`] === false) {
                    continue;
                }

                if (!overallSeen[appearance.appearanceId]) {
                    overallData.total++;
                }

                parentData.total++;
                catData.total++;
                setData.total++;

                if (
                    stores.userData.hasAppearance.has(appearance.appearanceId)
                ) {
                    if (!overallSeen[appearance.appearanceId]) {
                        overallData.have++;
                    }

                    parentData.have++;
                    catData.have++;
                    setData.have++;
                }

                overallSeen[appearance.appearanceId] = true;
            }
        }
    }

    return ret;
}

function buildAppearanceCache(stores: LazyStores) {
    console.time('buildAppearanceCache');

    const byExpansion: Record<
        number,
        Record<string, AppearanceDataSet>
    > = Object.fromEntries(
        Object.values(expansionMap).map((expansion) => [expansion.id, {}]),
    );

    const byAppearanceId: Record<
        string,
        Record<number, [number, number, number][]>
    > = {};
    const keyCache: Record<
        number,
        Record<number, Record<number, Record<number, string>>>
    > = {};
    for (const item of Object.values(stores.itemData.items)) {
        if (!item.appearances || byExpansion[item.expansion] === undefined) {
            continue;
        }

        const itemKey = ((((keyCache[item.expansion] ||= {})[item.classId] ||=
            {})[item.subclassId] ||= {})[item.inventoryType] ||= [
            item.expansion,
            item.classId,
            item.subclassId,
            item.inventoryType,
        ].join('|'));
        // const itemKey = [item.expansion, item.classId, item.subclassId, item.inventoryType].join('|')
        // const itemKey = `${item.expansion}|${item.classId}|${item.subclassId}|${item.inventoryType}`
        const keyedData = (byAppearanceId[itemKey] ||= {});

        for (const appearance of Object.values(item.appearances)) {
            const appearanceData = (keyedData[appearance.appearanceId] ||= []);
            appearanceData.push([item.id, item.quality, appearance.modifier]);
        }
    }

    // Group appearances by expansion
    for (const [key, appearanceMap] of Object.entries(byAppearanceId)) {
        const [expansion, classId, subclassId, inventoryType] = key
            .split('|')
            .map((n) => parseInt(n));

        let sortKey: string;
        let nameParts: string[];
        switch (classId) {
            case ItemClass.Armor:
                nameParts = [
                    'Armor',
                    getArmorSubType(
                        stores.staticData,
                        subclassId,
                        inventoryType,
                    ),
                ];
                if (subclassId >= 1 && subclassId <= 4) {
                    sortKey = `00|${leftPad(subclassId, 2, '0')}|${leftPad(typeOrderMap[inventoryType] || 99, 2, '0')}`;
                } else {
                    sortKey = `01|${nameParts[1]}`;
                }
                break;

            case ItemClass.Weapon:
                nameParts = [
                    'Weapon',
                    weaponSubclassToString[subclassId] || `?${subclassId}?`,
                ];
                sortKey = `05|${leftPad(weaponSubclassOrderMap[subclassId] || 99, 2, '0')}`;
                break;

            default:
                nameParts = [`?${classId}?`];
                sortKey = `09|${leftPad(classId, 2, '0')}`;
                break;
        }

        // sort appearances by:
        // - min(itemId) descending
        // - modifier sort order
        const sortedData = sortBy(Object.entries(appearanceMap), ([, arrays]) =>
            [
                leftPad(
                    999999 - Math.min(...arrays.map((array) => array[0])),
                    6,
                    '0',
                ),
                leftPad(
                    99 -
                        Math.min(
                            ...arrays.map(
                                (array) => modifierSortOrder[array[2]] || 0,
                            ),
                        ),
                    2,
                    '0',
                ),
            ].join('|'),
        );

        const name = nameParts.join(' - ');
        const nameMap = (byExpansion[expansion][name] ||= new AppearanceDataSet(
            name,
            sortKey,
        ));

        for (const [appearanceId, appearanceArrays] of sortedData) {
            nameMap.appearances.push(
                new AppearanceDataAppearance(
                    parseInt(appearanceId),
                    appearanceArrays,
                ),
            );
        }
    }

    appearanceCache = Object.fromEntries(
        sortBy(Object.entries(byExpansion), ([key]) => 100 - parseInt(key)).map(
            ([key, groups]) => [
                `expansion--${expansionMap[parseInt(key)].slug}`,
                sortBy(Object.values(groups), (group) => group.sortKey),
            ],
        ),
    );

    for (const [expansion, sets] of sortBy(
        Object.entries(appearanceCache),
        ([exp]) => 100 - parseInt(exp),
    )) {
        for (const set of sets) {
            let typeName: string;

            const armorMatches = set.name.match(
                /^Armor - (Cloth|Leather|Mail|Plate) (Head|Shoulders|Chest|Wrist|Hands|Waist|Legs|Feet)/,
            );
            if (armorMatches) {
                typeName = `${armorMatches[1].toLowerCase()}--${armorMatches[2].toLowerCase()}`;
            } else {
                const weaponMatches = set.name.match(/^Weapon - (.*?)$/);
                if (weaponMatches) {
                    typeName = `weapons--${weaponMatches[1].toLowerCase().replace(/ /g, '-')}`;
                }
            }

            if (typeName) {
                appearanceCache[typeName] ||= [];

                const dataSet = new AppearanceDataSet(
                    expansionSlugMap[expansion.split('--')[1]].name,
                    null,
                );
                dataSet.appearances = set.appearances;

                appearanceCache[typeName].push(dataSet);
            }
        }
    }

    console.timeEnd('buildAppearanceCache');
}

function getArmorSubType(
    staticData: StaticData,
    subClass: number,
    inventoryType: number,
): string {
    const slotString = staticData.inventoryTypes[inventoryType];
    //const slotString = (InventoryType[inventoryType] || `?${inventoryType}?`).replace('2', '')
    if (subClass >= 1 && subClass <= 4) {
        const typeString = ArmorType[subClass] || `?${subClass}?`;
        return `${typeString} ${slotString}`;
    } else {
        return slotString;
    }
}

const modifierSortOrder: Record<number, number> = {
    156: 41, // Mythic Fancy
    3: 40, // Mythic
    155: 31, // Heroic Fancy
    1: 30, // Heroic
    154: 21, // Normal Fancy
    0: 20, // Normal
    153: 11, // LFR Fancy
    4: 10, // LFR
};
