import intersectionWith from 'lodash/intersectionWith';

import { classByArmorType } from '@/data/character-class';
import { pvpCurrencies } from '@/data/currencies';
import { transmogTypes } from '@/data/transmog';
import { ArmorSubclass } from '@/enums/armor-subclass';
import { ArmorType } from '@/enums/armor-type';
import { Faction } from '@/enums/faction';
import { InventoryType } from '@/enums/inventory-type';
import { ItemClass } from '@/enums/item-class';
import { LookupType } from '@/enums/lookup-type';
import { PlayableClass, PlayableClassMask } from '@/enums/playable-class';
import { RewardType } from '@/enums/reward-type';
import { wowthingData } from '@/shared/stores/data';
import { DbThingType } from '@/shared/stores/db/enums';
import { UserCount } from '@/types';
import { ManualDataVendorGroup } from '@/types/data/manual';
import { getCurrencyCosts } from '@/utils/get-currency-costs';
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
import { getBonusIdModifier } from '@/utils/items/get-bonus-id-modifier';
import getTransmogClassMask from '@/utils/get-transmog-class-mask';
import { rewardToLookup } from '@/utils/rewards/reward-to-lookup';
import { userHasLookup } from '@/utils/rewards/user-has-lookup';
import type { DbDataQuery } from '@/shared/stores/db/types';
import type { Settings } from '@/shared/stores/settings/types';
import type {
    ManualDataSharedVendor,
    ManualDataVendorCategory,
    ManualDataVendorItem,
} from '@/types/data/manual';
import type { UserData } from '@/types';
import type { UserQuestData } from '@/types/data';
import type { VendorState } from '../local-storage';
import type { LazyTransmog } from './transmog';

const tierRegex = new RegExp(/ - T\d\d/);

export interface LazyVendors {
    stats: Record<string, UserCount>;
    userHas: Record<string, boolean>;
}

interface LazyStores {
    settings: Settings;
    vendorState: VendorState;
    userData: UserData;
    userQuestData: UserQuestData;
    lazyTransmog: LazyTransmog;
}

export function doVendors(stores: LazyStores): LazyVendors {
    console.time('LazyStore.doVendors');

    for (const vendor of Object.values(wowthingData.manual.shared.vendors)) {
        vendor.createFarmData();
    }

    const visitCategory = (category: ManualDataVendorCategory) => {
        if (category === null) {
            return;
        }

        for (const childCategory of category.children) {
            const hasVendorSets = childCategory?.vendorSets?.length > 0;
            if (
                childCategory === null ||
                (childCategory.vendorMaps.length === 0 &&
                    childCategory.vendorTags.length === 0 &&
                    !hasVendorSets)
            ) {
                continue;
            }

            const autoSeen: Record<string, ManualDataVendorItem> = {};

            // Remove any auto groups
            childCategory.groups = childCategory.groups.filter((group) => group.auto !== true);

            // Find useful vendors
            const dbMap: Record<number, ManualDataSharedVendor> = {};

            const vendorIdSets: number[][] = [[], []];
            for (const mapName of childCategory.vendorMaps) {
                vendorIdSets[0].push(...(wowthingData.manual.shared.vendorsByMap[mapName] || []));
            }

            for (const tagName of childCategory.vendorTags) {
                vendorIdSets[1].push(...(wowthingData.manual.shared.vendorsByTag[tagName] || []));
            }

            const vendorIds =
                childCategory.vendorMaps.length > 0 && childCategory.vendorTags.length > 0
                    ? intersectionWith(...vendorIdSets, (a, b) => a === b)
                    : vendorIdSets.flat();

            const query: DbDataQuery = {
                maps: childCategory.vendorMaps,
                tags: childCategory.vendorTags,
                type: DbThingType.Vendor,
            };

            for (const entry of wowthingData.db.search(query)) {
                dbMap[entry.id] = entry.asVendor();
                vendorIds.push(entry.id);
            }

            const autoGroups: Record<string, ManualDataVendorGroup> = {};

            for (const vendorId of vendorIds) {
                const vendor = wowthingData.manual.shared.vendors[vendorId] || dbMap[vendorId];

                let setPosition = 0;
                const coveredBySets = new Set<number>();
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

                    if (
                        hasVendorSets &&
                        !childCategory.vendorSets.some((setString) => set.name.includes(setString))
                    ) {
                        setPosition = setEnd;
                        continue;
                    }

                    const autoGroup = (autoGroups[groupKey] ||= new ManualDataVendorGroup(
                        set.name,
                        [],
                        true,
                        set.showNormalTag
                    ));
                    for (let itemIndex = setPosition; itemIndex < setEnd; itemIndex++) {
                        coveredBySets.add(itemIndex);
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

                        if (set.bonusIds?.length > 0 && !(item.bonusIds?.length > 0)) {
                            item.bonusIds = set.bonusIds;
                        }

                        // BonusIDs, whee
                        item.appearanceModifier = getBonusIdModifier(item.bonusIds || []);
                    }
                }

                for (let itemIndex = 0; itemIndex < vendor.sells.length; itemIndex++) {
                    if (hasVendorSets && !coveredBySets.has(itemIndex)) {
                        continue;
                    }

                    const item = vendor.sells[itemIndex];
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
                        item.type === RewardType.AccountQuest ||
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
                        if (wowthingData.manual.dragonridingItemToQuest.has(item.id)) {
                            [groupKey, groupName] = ['00dragonriding', 'Dragonriding'];
                        } else if (wowthingData.manual.druidFormItemToQuest.has(item.id)) {
                            [groupKey, groupName] = ['00druids', 'Druids'];
                        } else if (wowthingData.static.mountByItemId.has(item.id)) {
                            [groupKey, groupName] = ['00mounts', 'Mounts'];
                        } else if (wowthingData.static.petByItemId.has(item.id)) {
                            [groupKey, groupName] = ['00pets', 'Pets'];
                        } else if (wowthingData.static.toyByItemId.has(item.id)) {
                            [groupKey, groupName] = ['00toys', 'Toys'];
                        } else if (wowthingData.items.completesQuest[item.id]) {
                            [groupKey, groupName] = ['10misc', 'Misc'];
                        } else if (wowthingData.static.professionAbilityByItemId.has(item.id)) {
                            [groupKey, groupName] = ['10recipes', 'Recipes'];
                        } else {
                            [groupKey, groupName] = ['90transmog', 'Transmog'];
                        }
                    }

                    item.faction = vendor.faction;

                    item.sortedCosts = getCurrencyCosts(item.costs);

                    if (groupKey) {
                        const autoGroup = (autoGroups[groupKey] ||= new ManualDataVendorGroup(
                            groupName,
                            [],
                            true
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
            childCategory.groups = groups.map(([, group]) => group);

            visitCategory(childCategory);
        }
    };

    for (const category of wowthingData.manual.vendors.sets) {
        visitCategory(category);
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
    for (const illusionGroup of wowthingData.manual.illusions) {
        if (illusionGroup.name.startsWith('Unavailable')) {
            for (const illusionItem of illusionGroup.items) {
                unavailableIllusions.push(illusionItem.enchantmentId);
            }
        }
    }

    for (const rootCategory of wowthingData.manual.vendors.sets) {
        if (rootCategory === null) {
            continue;
        }

        const buildCategoryStats = (
            category: ManualDataVendorCategory,
            baseSlug: string,
            parentStats: UserCount[]
        ) => {
            if (category === null) {
                return;
            }

            const catKey = baseSlug ? `${baseSlug}--${category.slug}` : category.slug;
            const catStats = (stats[catKey] = new UserCount());

            for (let groupIndex = 0; groupIndex < category.groups.length; groupIndex++) {
                const group = category.groups[groupIndex];
                group.sellsFiltered = [];

                if (
                    !stores.vendorState.showPvp &&
                    group.sells.some((vendorItem) =>
                        getNumberKeyedEntries(vendorItem.costs).some(([currencyId]) =>
                            pvpCurrencies.has(currencyId)
                        )
                    )
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
                    item.sortedCosts = getCurrencyCosts(item.costs);

                    if (item.classMask > 0 && (item.classMask & classMask) === 0) {
                        continue;
                    }

                    // Transmog sets are annoying
                    const transmogSetId = wowthingData.items.teachesTransmog[item.id];
                    if (transmogSetId) {
                        const transmogSet = wowthingData.static.transmogSetById.get(transmogSetId);
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
                            const item = wowthingData.items.items[itemId];
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
                            (allArmor &&
                                transmogSet.classMask > 0 &&
                                (transmogSet.classMask & armorClassMask) === 0) ||
                            (allWeapon && !stores.vendorState.showWeapons)
                        ) {
                            continue;
                        }
                    }

                    const sharedItem = wowthingData.items.items[item.id];

                    if (sharedItem && transmogTypes.has(item.type)) {
                        if (sharedItem.allianceOnly) {
                            item.faction = Faction.Alliance;
                        } else if (sharedItem.hordeOnly) {
                            item.faction = Faction.Horde;
                        }
                    }

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
                        item.type,
                        item.id,
                        item.trackingQuestId
                    );

                    if (
                        (!stores.vendorState.showIllusions && lookupType === LookupType.Illusion) ||
                        (!stores.vendorState.showMounts && lookupType === LookupType.Mount) ||
                        (!stores.vendorState.showPets && lookupType === LookupType.Pet) ||
                        (!stores.vendorState.showRecipes && lookupType === LookupType.Recipe) ||
                        (!stores.vendorState.showToys && lookupType === LookupType.Toy) ||
                        (!stores.vendorState.showCosmetics && item.type === RewardType.Cosmetic) ||
                        (!stores.vendorState.showDragonriding &&
                            wowthingData.manual.dragonridingItemToQuest.has(item.id)) ||
                        (item.type === RewardType.Armor &&
                            ((item.subType === 1 && !stores.vendorState.showCloth) ||
                                (item.subType === 2 && !stores.vendorState.showLeather) ||
                                (item.subType === 3 && !stores.vendorState.showMail) ||
                                (item.subType === 4 && !stores.vendorState.showPlate))) ||
                        (item.type === RewardType.Weapon && !stores.vendorState.showWeapons) ||
                        (lookupType === LookupType.Transmog &&
                            sharedItem?.classId === ItemClass.Armor &&
                            ((sharedItem.subclassId === ArmorSubclass.Cloth &&
                                !stores.vendorState.showCloth) ||
                                (sharedItem.subclassId === ArmorSubclass.Leather &&
                                    !stores.vendorState.showLeather) ||
                                (sharedItem.subclassId === ArmorSubclass.Mail &&
                                    !stores.vendorState.showMail) ||
                                (sharedItem.subclassId === ArmorSubclass.Plate &&
                                    !stores.vendorState.showPlate))) ||
                        (lookupType === LookupType.Transmog &&
                            sharedItem?.classId === ItemClass.Weapon &&
                            !stores.vendorState.showWeapons) ||
                        (lookupType === LookupType.Transmog &&
                            sharedItem?.cosmetic &&
                            !stores.vendorState.showCosmetics) ||
                        (sharedItem?.inventoryType === InventoryType.Back &&
                            !stores.vendorState.showCloaks)
                    ) {
                        continue;
                    }

                    const hasDrop = userHasLookup(
                        stores.settings,
                        stores.userData,
                        stores.userQuestData,
                        stores.lazyTransmog,
                        lookupType,
                        lookupId,
                        {
                            appearanceIds: item.appearanceIds,
                            completionist: masochist,
                            modifier: item.appearanceModifier,
                        }
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

                    for (const parentStat of parentStats) {
                        parentStat.total++;
                    }

                    catStats.total++;
                    groupStats.total++;

                    if (hasDrop) {
                        if (!seen[thingKey]) {
                            overallStats.have++;
                        }

                        for (const parentStat of parentStats) {
                            parentStat.have++;
                        }

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

                group.sellsFiltered.sort((a, b) => {
                    if (a.classMask in PlayableClassMask && b.classMask in PlayableClassMask) {
                        const aSpecs = wowthingData.items.specOverrides[a.id];
                        const bSpecs = wowthingData.items.specOverrides[b.id];
                        if (aSpecs?.length > 0 && bSpecs?.length > 0) {
                            const aSpecString = aSpecs
                                .map(
                                    (id) =>
                                        wowthingData.static.characterSpecializationById.get(id)
                                            .order
                                )
                                .join('-');
                            const bSpecString = bSpecs
                                .map(
                                    (id) =>
                                        wowthingData.static.characterSpecializationById.get(id)
                                            .order
                                )
                                .join('-');
                            return aSpecString.localeCompare(bSpecString);
                        }
                    }

                    return 0;
                });

                group.stats = groupStats;
            } // group of category.groups

            for (const childCategory of category.children) {
                buildCategoryStats(childCategory, catKey, [...parentStats, catStats]);
            }
        };

        buildCategoryStats(rootCategory, '', []);
    }

    console.timeEnd('LazyStore.doVendors');

    return {
        stats,
        userHas,
    };
}
