import { classByArmorType } from '@/data/character-class';
import { transmogTypes } from '@/data/transmog';
import { ArmorType } from '@/enums/armor-type';
import { Faction } from '@/enums/faction';
import { InventoryType } from '@/enums/inventory-type';
import { ItemClass } from '@/enums/item-class';
import { LookupType } from '@/enums/lookup-type';
import { PlayableClass, PlayableClassMask } from '@/enums/playable-class';
import { RewardType } from '@/enums/reward-type';
import { UserCount } from '@/types';
import { ManualDataVendorGroup } from '@/types/data/manual';
import { getCurrencyCosts } from '@/utils/get-currency-costs';
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
import getTransmogClassMask from '@/utils/get-transmog-class-mask';
import { rewardToLookup } from '@/utils/rewards/reward-to-lookup';
import { userHasLookup } from '@/utils/rewards/user-has-lookup';
import type { ItemData } from '@/types/data/item';
import type { StaticData } from '@/shared/stores/static/types';
import type { ManualData, ManualDataVendorItem } from '@/types/data/manual';
import type { UserData } from '@/types';
import type { UserQuestData } from '@/types/data';
import type { Settings } from '@/shared/stores/settings/types';
import type { VendorState } from '../local-storage';
import type { LazyTransmog } from './transmog';

const pvpRegex = new RegExp(/ - S\d\d/);
const tierRegex = new RegExp(/ - T\d\d/);

export interface LazyVendors {
    stats: Record<string, UserCount>;
    userHas: Record<string, boolean>;
}

interface LazyStores {
    settings: Settings;
    vendorState: VendorState;
    itemData: ItemData;
    manualData: ManualData;
    staticData: StaticData;
    userData: UserData;
    userQuestData: UserQuestData;
    lazyTransmog: LazyTransmog;
}

export function doVendors(stores: LazyStores): LazyVendors {
    console.time('LazyStore.doVendors');

    for (const vendor of Object.values(stores.manualData.shared.vendors)) {
        vendor.createFarmData(stores.itemData, stores.manualData, stores.staticData);
    }

    for (const categories of stores.manualData.vendors.sets) {
        if (categories === null) {
            continue;
        }

        for (const category of categories) {
            if (
                category === null ||
                (category.vendorMaps.length === 0 && category.vendorTags.length === 0)
            ) {
                continue;
            }

            const autoSeen: Record<string, ManualDataVendorItem> = {};

            // Remove any auto groups
            category.groups = category.groups.filter((group) => group.auto !== true);

            // Find useful vendors
            const vendorIds: number[] = [];
            for (const mapName of category.vendorMaps) {
                vendorIds.push(...(stores.manualData.shared.vendorsByMap[mapName] || []));
            }
            for (const tagName of category.vendorTags) {
                vendorIds.push(...(stores.manualData.shared.vendorsByTag[tagName] || []));
            }

            const autoGroups: Record<string, ManualDataVendorGroup> = {};

            for (const vendorId of vendorIds) {
                const vendor = stores.manualData.shared.vendors[vendorId];

                let setPosition = 0;
                for (let setIndex = 0; setIndex < vendor.sets.length; setIndex++) {
                    const set = vendor.sets[setIndex];
                    const groupKey = `${set.sortKey ? '09' + set.sortKey : 10 + setIndex}${set.name}`;

                    if (set.range[1] > 0) {
                        setPosition = set.range[1];
                    }

                    let setEnd = setPosition + set.range[0];
                    if (set.range[0] === -1) {
                        setEnd = vendor.sells.length;
                    }

                    const autoGroup = (autoGroups[groupKey] ||= new ManualDataVendorGroup(
                        set.name,
                        [],
                        true,
                        set.showNormalTag,
                    ));
                    for (let itemIndex = setPosition; itemIndex < setEnd; itemIndex++) {
                        setPosition++;

                        const item = vendor.sells[itemIndex];
                        const seenKey = `${item.type}|${item.id}|${(item.bonusIds || []).join(',')}`;
                        const autoItem = autoSeen[seenKey];
                        if (!autoItem) {
                            autoGroup.sells.push(item);
                            autoSeen[seenKey] = item;
                        } else if (
                            autoItem.faction !== Faction.Both &&
                            item.faction !== autoItem.faction
                        ) {
                            autoItem.faction = Faction.Both;
                        }
                    }
                }

                for (const item of vendor.sells) {
                    let groupKey: string;
                    let groupName: string;

                    if (item.type === RewardType.Illusion) {
                        [groupKey, groupName] = ['00illusions', 'Illusions'];
                    } else if (item.type === RewardType.Mount) {
                        [groupKey, groupName] = ['00mounts', 'Mounts'];
                    } else if (item.type === RewardType.Pet) {
                        [groupKey, groupName] = ['00pets', 'Pets'];
                    } else if (item.type === RewardType.Toy) {
                        [groupKey, groupName] = ['00toys', 'Toys'];
                    } else if (
                        item.type === RewardType.AccountTrackingQuest ||
                        item.type === RewardType.CharacterTrackingQuest
                    ) {
                        [groupKey, groupName] = ['10misc', 'Misc'];
                    } else if (item.type === RewardType.Armor) {
                        [groupKey, groupName] = ['80armor', 'Armor'];
                    } else if (item.type === RewardType.Weapon) {
                        [groupKey, groupName] = ['80weapons', 'Weapons'];
                    } else if (
                        item.type === RewardType.Cosmetic ||
                        item.type === RewardType.Transmog
                    ) {
                        [groupKey, groupName] = ['90transmog', 'Transmog'];
                    } else if (item.type === RewardType.Item) {
                        if (stores.manualData.dragonridingItemToQuest[item.id]) {
                            [groupKey, groupName] = ['00dragonriding', 'Dragonriding'];
                        } else if (stores.manualData.druidFormItemToQuest[item.id]) {
                            [groupKey, groupName] = ['00druids', 'Druids'];
                        } else if (stores.staticData.mountsByItem[item.id]) {
                            [groupKey, groupName] = ['00mounts', 'Mounts'];
                        } else if (stores.staticData.petsByItem[item.id]) {
                            [groupKey, groupName] = ['00pets', 'Pets'];
                        } else if (stores.staticData.toys[item.id]) {
                            [groupKey, groupName] = ['00toys', 'Toys'];
                        } else if (stores.itemData.completesQuest[item.id]) {
                            [groupKey, groupName] = ['10misc', 'Misc'];
                        } else if (stores.staticData.professionAbilityByItemId[item.id]) {
                            [groupKey, groupName] = ['10recipes', 'Recipes'];
                        }
                    }

                    item.faction = vendor.faction;
                    item.sortedCosts = getCurrencyCosts(
                        stores.itemData,
                        stores.staticData,
                        item.costs,
                    );

                    if (groupKey) {
                        const autoGroup = (autoGroups[groupKey] ||= new ManualDataVendorGroup(
                            groupName,
                            [],
                            true,
                        ));

                        const seenKey = `${item.type}|${item.id}|${(item.bonusIds || []).join(',')}`;
                        const autoItem = autoSeen[seenKey];
                        if (!autoItem) {
                            autoGroup.sells.push(item);
                            autoSeen[seenKey] = item;
                        } else if (
                            autoItem.faction !== Faction.Both &&
                            item.faction !== autoItem.faction
                        ) {
                            autoItem.faction = Faction.Both;
                        }
                    }
                }
            }

            const groups = Object.entries(autoGroups);
            groups.sort();
            category.groups = groups.map(([, group]) => group);
        }
    }

    // stats
    const classMask = getTransmogClassMask(stores.settings);
    const masochist = stores.settings.transmog.completionistMode;

    let armorClassMask = 0;
    for (const [armorType, playableClasses] of getNumberKeyedEntries(classByArmorType)) {
        if (
            (armorType === ArmorType.Cloth && stores.vendorState.showCloth) ||
            (armorType === ArmorType.Leather && stores.vendorState.showLeather) ||
            (armorType === ArmorType.Mail && stores.vendorState.showMail) ||
            (armorType === ArmorType.Plate && stores.vendorState.showPlate)
        ) {
            for (const playableClass of playableClasses) {
                armorClassMask |=
                    PlayableClassMask[
                        PlayableClass[playableClass] as keyof typeof PlayableClassMask
                    ];
            }
        }
    }

    const seen: Record<string, boolean> = {};
    const stats: Record<string, UserCount> = {};
    const userHas: Record<string, boolean> = {};

    const overallStats = (stats['OVERALL'] = new UserCount());

    const unavailableIllusions: number[] = [];
    for (const illusionGroup of stores.manualData.illusions) {
        if (illusionGroup.name.startsWith('Unavailable')) {
            for (const illusionItem of illusionGroup.items) {
                unavailableIllusions.push(illusionItem.enchantmentId);
            }
        }
    }

    for (const categories of stores.manualData.vendors.sets) {
        if (categories === null) {
            continue;
        }

        const baseStats = (stats[categories[0].slug] = new UserCount());

        for (const category of categories.slice(1)) {
            if (category === null) {
                continue;
            }

            const catKey = `${categories[0].slug}--${category.slug}`;
            const catStats = (stats[catKey] = new UserCount());

            for (let groupIndex = 0; groupIndex < category.groups.length; groupIndex++) {
                const group = category.groups[groupIndex];
                group.sellsFiltered = [];

                if (
                    !stores.vendorState.showPvp &&
                    (pvpRegex.test(group.name) || group.name.includes('War Mode'))
                ) {
                    continue;
                }
                if (!stores.vendorState.showTier && tierRegex.test(group.name)) {
                    continue;
                }
                if (!stores.vendorState.showAwakened && group.name.endsWith('Awakened')) {
                    continue;
                }

                const groupKey = `${catKey}--${groupIndex}`;
                const groupStats = (stats[groupKey] = new UserCount());

                const appearanceMap: Record<number, ManualDataVendorItem> = {};

                for (const item of group.sells) {
                    item.sortedCosts = getCurrencyCosts(
                        stores.itemData,
                        stores.staticData,
                        item.costs,
                    );

                    if (item.classMask > 0 && (item.classMask & classMask) === 0) {
                        continue;
                    }

                    // Transmog sets are annoying
                    const transmogSetId = stores.itemData.teachesTransmog[item.id];
                    if (transmogSetId) {
                        const transmogSet = stores.staticData.transmogSets[transmogSetId];
                        if (
                            transmogSet.classMask > 0 &&
                            (transmogSet.classMask & classMask) === 0
                        ) {
                            continue;
                        }

                        // Scan the actual items within the transmog set now
                        let allArmor = true;
                        let allClassMask = true;
                        let allWeapon = true;
                        transmogSet.items.forEach(([itemId]) => {
                            const item = stores.itemData.items[itemId];
                            if (!item) {
                                return;
                            }

                            if (item.classId !== ItemClass.Armor) {
                                allArmor = false;
                            }
                            if (item.classId !== ItemClass.Weapon) {
                                allWeapon = false;
                            }
                            if (item.classMask > 0 && (item.classMask & classMask) === 0) {
                                allClassMask = false;
                            }
                        });
                        if (
                            !allClassMask ||
                            (allArmor && (transmogSet.classMask & armorClassMask) === 0) ||
                            (allWeapon && !stores.vendorState.showWeapons)
                        ) {
                            continue;
                        }
                    }

                    const sharedItem = stores.itemData.items[item.id];

                    if (masochist) {
                        item.extraAppearances = 0;
                    } else if (transmogTypes.has(item.type)) {
                        const appearanceId =
                            item.appearanceIds?.length === 1
                                ? item.appearanceIds[0]
                                : sharedItem?.appearances?.[0]?.appearanceId || 0;
                        if (appearanceId) {
                            const existingItem = appearanceMap[appearanceId];
                            if (existingItem) {
                                existingItem.extraAppearances++;

                                if (
                                    existingItem.faction !== Faction.Both &&
                                    item.faction !== existingItem.faction
                                ) {
                                    existingItem.faction = Faction.Both;
                                }

                                continue;
                            } else {
                                appearanceMap[appearanceId] = item;
                                item.extraAppearances = 0;
                            }
                        }
                    }

                    // Skip filtered things
                    const [lookupType, lookupId] = rewardToLookup(
                        stores.itemData,
                        stores.manualData,
                        stores.staticData,
                        item.type,
                        item.id,
                    );

                    if (
                        (!stores.vendorState.showIllusions && lookupType === LookupType.Illusion) ||
                        (!stores.vendorState.showMounts && lookupType === LookupType.Mount) ||
                        (!stores.vendorState.showPets && lookupType === LookupType.Pet) ||
                        (!stores.vendorState.showToys && lookupType === LookupType.Toy) ||
                        (item.type === RewardType.Armor &&
                            ((item.subType === 1 && !stores.vendorState.showCloth) ||
                                (item.subType === 2 && !stores.vendorState.showLeather) ||
                                (item.subType === 3 && !stores.vendorState.showMail) ||
                                (item.subType === 4 && !stores.vendorState.showPlate))) ||
                        (item.type === RewardType.Weapon && !stores.vendorState.showWeapons) ||
                        (sharedItem?.inventoryType === InventoryType.Back &&
                            !stores.vendorState.showCloaks)
                    ) {
                        continue;
                    }

                    const hasDrop = userHasLookup(
                        stores.settings,
                        stores.itemData,
                        stores.staticData,
                        stores.userData,
                        stores.userQuestData,
                        stores.lazyTransmog,
                        lookupType,
                        lookupId,
                        item.appearanceIds,
                        masochist,
                    );

                    // Skip unavailable illusions
                    if (
                        lookupType === LookupType.Illusion &&
                        item.appearanceIds?.length > 0 &&
                        unavailableIllusions.indexOf(item.appearanceIds[0]) >= 0 &&
                        !hasDrop
                    ) {
                        continue;
                    }

                    const thingKey = `${item.type}|${item.id}|${(item.bonusIds || []).join(',')}`;

                    if (!seen[thingKey]) {
                        overallStats.total++;
                    }
                    baseStats.total++;
                    catStats.total++;
                    groupStats.total++;

                    if (hasDrop) {
                        if (!seen[thingKey]) {
                            overallStats.have++;
                        }
                        baseStats.have++;
                        catStats.have++;
                        groupStats.have++;

                        userHas[thingKey] = true;
                    }

                    seen[thingKey] = true;

                    if (
                        (hasDrop && !stores.vendorState.showCollected) ||
                        (!hasDrop && !stores.vendorState.showUncollected)
                    ) {
                        continue;
                    }

                    group.sellsFiltered.push(item);
                } // item of group.sells

                group.stats = groupStats;
            } // group of category.groups
        }
    }

    console.timeEnd('LazyStore.doVendors');

    return {
        stats,
        userHas,
    };
}
