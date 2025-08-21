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
import { browserState } from '@/shared/state/browser.svelte';
import { settingsState } from '@/shared/state/settings.svelte';
import { wowthingData } from '@/shared/stores/data';
import { DbThingType } from '@/shared/stores/db/enums';
import { UserCount } from '@/types';
import { ManualDataVendorGroup } from '@/types/data/manual';
import { getCurrencyCosts } from '@/utils/get-currency-costs';
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
import { getBonusIdModifier } from '@/utils/items/get-bonus-id-modifier';
import { rewardToLookup } from '@/utils/rewards/reward-to-lookup';
import { snapshotStateForUserHasLookup } from '@/utils/rewards/snapshot-state-for-user-has-lookup.svelte';
import { userHasLookup } from '@/utils/rewards/user-has-lookup';
import type { DbDataQuery } from '@/shared/stores/db/types';
import type {
    ManualDataSharedVendor,
    ManualDataVendorCategory,
    ManualDataVendorItem,
} from '@/types/data/manual';

const tierRegex = new RegExp(/ - T\d\d/);

export interface LazyVendors {
    allCurrencies: Set<number>;
    byNpcId: Record<number, ManualDataSharedVendor>;
    stats: Record<string, UserCount>;
    userHas: Record<string, boolean>;
}

class LazyVendorsProcessor {
    private _createdFarmData = false;
    private _visitedCategories = false;
    private _allCurrencies = new Set<number>();
    private _byNpcId: Record<number, ManualDataSharedVendor> = {};

    private _snapshot = $derived.by(() => snapshotStateForUserHasLookup());

    public process() {
        const snapshot = this._snapshot;
        const vendorState = $state.snapshot(browserState.current).vendors;

        if (!this._createdFarmData) {
            this._createdFarmData = true;
            for (const vendor of Object.values(wowthingData.manual.shared.vendors)) {
                vendor.createFarmData();
            }
        }

        if (!this._visitedCategories) {
            this._visitedCategories = true;
            for (const category of wowthingData.manual.vendors.sets) {
                this.visitCategory(category);
            }
        }

        // stats
        const classMask = settingsState.transmogClassMask;
        const masochist = settingsState.value.transmog.completionistMode;

        let armorClassMask = 0;
        for (const [armorType, playableClasses] of getNumberKeyedEntries(classByArmorType)) {
            if (
                (armorType === ArmorType.Cloth && vendorState.showCloth) ||
                (armorType === ArmorType.Leather && vendorState.showLeather) ||
                (armorType === ArmorType.Mail && vendorState.showMail) ||
                (armorType === ArmorType.Plate && vendorState.showPlate)
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

        // [category, slug[]]
        const queue: [ManualDataVendorCategory, string[]][] = wowthingData.manual.vendors.sets
            .filter((root) => !!root)
            .map((root) => [root, [root.slug]]);
        while (queue.length > 0) {
            const [category, slugs] = queue.pop();

            const catKey = slugs.join('--');
            const catStats = (stats[catKey] = new UserCount());

            const parentStats: UserCount[] = [];
            if (slugs.length > 1) {
                let parentSlug: string = undefined;
                for (const slug of slugs) {
                    parentSlug = parentSlug ? `${parentSlug}--${slug}` : slug;
                    parentStats.push(stats[parentSlug]);
                }
            }

            for (let groupIndex = 0; groupIndex < category.groups.length; groupIndex++) {
                const group = category.groups[groupIndex];
                const sellsFiltered: ManualDataVendorItem[] = [];

                if (
                    !vendorState.showPvp &&
                    group.sells.some((vendorItem) =>
                        getNumberKeyedEntries(vendorItem.costs).some(([currencyId]) =>
                            pvpCurrencies.has(currencyId)
                        )
                    )
                ) {
                    continue;
                }
                if (!vendorState.showTier && tierRegex.test(group.name)) {
                    continue;
                }
                if (!vendorState.showAwakened && group.name.endsWith('Awakened')) {
                    continue;
                }

                const groupKey = `${catKey}--${groupIndex}`;
                const groupStats = (stats[groupKey] = new UserCount());

                const appearanceMap: Record<number, ManualDataVendorItem> = {};

                for (const item of group.sells) {
                    // item.sortedCosts ||= getCurrencyCosts(item.costs);

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
                            (allWeapon && !vendorState.showWeapons)
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
                        (!vendorState.showIllusions && lookupType === LookupType.Illusion) ||
                        (!vendorState.showMounts && lookupType === LookupType.Mount) ||
                        (!vendorState.showPets && lookupType === LookupType.Pet) ||
                        (!vendorState.showRecipes && lookupType === LookupType.Recipe) ||
                        (!vendorState.showToys && lookupType === LookupType.Toy) ||
                        (!vendorState.showCosmetics && item.type === RewardType.Cosmetic) ||
                        (!vendorState.showDragonriding &&
                            wowthingData.manual.dragonridingItemToQuest.has(item.id)) ||
                        (item.type === RewardType.Armor &&
                            ((item.subType === 1 && !vendorState.showCloth) ||
                                (item.subType === 2 && !vendorState.showLeather) ||
                                (item.subType === 3 && !vendorState.showMail) ||
                                (item.subType === 4 && !vendorState.showPlate))) ||
                        (item.type === RewardType.Weapon && !vendorState.showWeapons) ||
                        (lookupType === LookupType.Transmog &&
                            sharedItem?.classId === ItemClass.Armor &&
                            ((sharedItem.subclassId === ArmorSubclass.Cloth &&
                                !vendorState.showCloth) ||
                                (sharedItem.subclassId === ArmorSubclass.Leather &&
                                    !vendorState.showLeather) ||
                                (sharedItem.subclassId === ArmorSubclass.Mail &&
                                    !vendorState.showMail) ||
                                (sharedItem.subclassId === ArmorSubclass.Plate &&
                                    !vendorState.showPlate))) ||
                        (lookupType === LookupType.Transmog &&
                            sharedItem?.classId === ItemClass.Weapon &&
                            !vendorState.showWeapons) ||
                        (lookupType === LookupType.Transmog &&
                            sharedItem?.cosmetic &&
                            !vendorState.showCosmetics) ||
                        (sharedItem?.inventoryType === InventoryType.Back &&
                            !vendorState.showCloaks)
                    ) {
                        continue;
                    }

                    const hasDrop = userHasLookup(snapshot, lookupType, lookupId, {
                        appearanceIds: item.appearanceIds,
                        completionist: masochist,
                        modifier: item.appearanceModifier,
                    });

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
                        (hasDrop && !vendorState.showCollected) ||
                        (!hasDrop && !vendorState.showUncollected)
                    ) {
                        continue;
                    }

                    sellsFiltered.push(item);
                } // item of group.sells

                sellsFiltered.sort((a, b) => {
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

                group.sellsFiltered = sellsFiltered;
                group.stats = groupStats;
            } // group of category.groups

            for (const childCategory of category.children.filter((child) => !!child)) {
                queue.push([childCategory, [...slugs, childCategory.slug]]);
            }
        }

        return {
            allCurrencies: this._allCurrencies,
            byNpcId: this._byNpcId,
            stats,
            userHas,
        } as LazyVendors;
    }

    // recursively visit categories and do some initial setup work:
    // - generate auto groups
    // - ??
    private visitCategory(category: ManualDataVendorCategory) {
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

            // Find useful vendors
            const dbMap: Record<number, ManualDataSharedVendor> = {};

            if (childCategory.vendorIds === undefined) {
                const vendorIdSets: number[][] = [[], []];
                for (const mapName of childCategory.vendorMaps) {
                    vendorIdSets[0].push(
                        ...(wowthingData.manual.shared.vendorsByMap[mapName] || [])
                    );
                }

                for (const tagName of childCategory.vendorTags) {
                    vendorIdSets[1].push(
                        ...(wowthingData.manual.shared.vendorsByTag[tagName] || [])
                    );
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

                childCategory.vendorIds = vendorIds;
            }

            const autoGroups: Record<string, ManualDataVendorGroup> = {};

            for (const vendorId of childCategory.vendorIds) {
                const vendor = wowthingData.manual.shared.vendors[vendorId] || dbMap[vendorId];
                this._byNpcId[vendor.id] ||= vendor;

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
                        set.showNormalTag,
                        set.overrideDifficulty
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

                        for (const [currencyId] of getNumberKeyedEntries(item.costs || {})) {
                            this._allCurrencies.add(currencyId);
                        }
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

                    item.sortedCosts ||= getCurrencyCosts(item.costs);

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

                    for (const [currencyId] of getNumberKeyedEntries(item.costs || {})) {
                        this._allCurrencies.add(currencyId);
                    }
                }
            }

            const groups = Object.entries(autoGroups);
            groups.sort();
            childCategory.groups = groups.map(([, group]) => group);

            this.visitCategory(childCategory);
        }
    }
}

const lazyVendorsProcessor = new LazyVendorsProcessor();

export function doVendors(): LazyVendors {
    console.time('LazyState.doVendors');

    const result = lazyVendorsProcessor.process();

    console.timeEnd('LazyState.doVendors');

    return result;
}
