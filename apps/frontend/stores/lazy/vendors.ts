import { transmogTypes } from '@/data/transmog'
import { Faction } from '@/enums/faction'
import { InventoryType } from '@/enums/inventory-type'
import { RewardType } from '@/enums/reward-type'
import { UserCount } from '@/types'
import { ManualDataVendorGroup } from '@/types/data/manual'
import { getCurrencyCosts } from '@/utils/get-currency-costs'
import getTransmogClassMask from '@/utils/get-transmog-class-mask'
import userHasDrop from '@/utils/user-has-drop'
import type { ItemData } from '@/types/data/item'
import type { StaticData } from '@/types/data/static'
import type { ManualData, ManualDataVendorItem } from '@/types/data/manual'
import type { Settings, UserData } from '@/types'
import type { UserQuestData, UserTransmogData } from '@/types/data'
import type { VendorState } from '../local-storage'


const pvpRegex = new RegExp(/ - S\d\d/)
const tierRegex = new RegExp(/ - T\d\d/)


export interface LazyVendors {
    stats: Record<string, UserCount>
    userHas: Record<string, boolean>
}

interface LazyStores {
    settings: Settings
    vendorState: VendorState
    itemData: ItemData
    manualData: ManualData
    staticData: StaticData
    userData: UserData,
    userQuestData: UserQuestData
    userTransmogData: UserTransmogData,
}

export function doVendors(stores: LazyStores): LazyVendors {
    console.time('LazyStore.doVendors')

    for (const vendor of Object.values(stores.manualData.shared.vendors)) {
        vendor.createFarmData(stores.itemData, stores.manualData, stores.staticData)
    }

    for (const categories of stores.manualData.vendors.sets) {
        if (categories === null) {
            continue
        }
        
        for (const category of categories) {
            if (category === null || (category.vendorMaps.length === 0 && category.vendorTags.length === 0)) {
                continue
            }

            const autoSeen: Record<string, ManualDataVendorItem> = {}

            // Remove any auto groups
            category.groups = category.groups.filter((group) => group.auto !== true)

            // Find useful vendors
            const vendorIds: number[] = []
            for (const mapName of category.vendorMaps) {
                vendorIds.push(...(stores.manualData.shared.vendorsByMap[mapName] || []))
            }
            for (const tagName of category.vendorTags) {
                vendorIds.push(...(stores.manualData.shared.vendorsByTag[tagName] || []))
            }

            const autoGroups: Record<string, ManualDataVendorGroup> = {}

            for (const vendorId of vendorIds) {
                const vendor = stores.manualData.shared.vendors[vendorId]

                let setPosition = 0;
                for (let setIndex = 0; setIndex < vendor.sets.length; setIndex++) {
                    const set = vendor.sets[setIndex]
                    const groupKey = `${set.sortKey ? '09' + set.sortKey : 10 + setIndex}${set.name}`
                    
                    if (set.range[1] > 0) {
                        setPosition = set.range[1]
                    }
                    
                    let setEnd = setPosition + set.range[0]
                    if (set.range[0] === -1) {
                        setEnd = vendor.sells.length
                    }

                    const autoGroup = autoGroups[groupKey] ||= new ManualDataVendorGroup(set.name, [], true)
                    for (let itemIndex = setPosition; itemIndex < setEnd; itemIndex++) {
                        setPosition++;

                        const item = vendor.sells[itemIndex]
                        const seenKey = `${item.type}|${item.id}|${(item.bonusIds || []).join(',')}`
                        const autoItem = autoSeen[seenKey]
                        if (!autoItem) {
                            autoGroup.sells.push(item)
                            autoSeen[seenKey] = item
                        }
                        else if (autoItem.faction !== Faction.Both && item.faction !== autoItem.faction) {
                            autoItem.faction = Faction.Both
                        }
                    }
                }

                for (const item of vendor.sells) {
                    let groupKey: string
                    let groupName: string

                    if (item.type === RewardType.Illusion) {
                        [groupKey, groupName] = ['00illusions', 'Illusions']
                    }
                    else if (item.type === RewardType.Mount) {
                        [groupKey, groupName] = ['00mounts', 'Mounts']
                    }
                    else if (item.type === RewardType.Pet) {
                        [groupKey, groupName] = ['00pets', 'Pets']
                    }
                    else if (item.type === RewardType.Toy) {
                        [groupKey, groupName] = ['00toys', 'Toys']
                    }
                    else if (item.type === RewardType.AccountTrackingQuest || item.type === RewardType.CharacterTrackingQuest) {
                        [groupKey, groupName] = ['10misc', 'Misc']
                    }
                    else if (item.type === RewardType.Armor) {
                        [groupKey, groupName] = ['80armor', 'Armor']
                    }
                    else if (item.type === RewardType.Weapon) {
                        [groupKey, groupName] = ['80weapons', 'Weapons']
                    }
                    else if (item.type === RewardType.Cosmetic || item.type === RewardType.Transmog) {
                        [groupKey, groupName] = ['90transmog', 'Transmog']
                    }

                    item.faction = vendor.faction
                    item.sortedCosts = getCurrencyCosts(stores.itemData, stores.staticData, item.costs)

                    if (groupKey) {
                        const autoGroup = autoGroups[groupKey] ||= new ManualDataVendorGroup(groupName, [], true)

                        const seenKey = `${item.type}|${item.id}|${(item.bonusIds || []).join(',')}`
                        const autoItem = autoSeen[seenKey]
                        if (!autoItem) {
                            autoGroup.sells.push(item)
                            autoSeen[seenKey] = item
                        }
                        else if (autoItem.faction !== Faction.Both && item.faction !== autoItem.faction) {
                            autoItem.faction = Faction.Both
                        }
                    }
                }
            }

            const groups = Object.entries(autoGroups)
            groups.sort()
            category.groups = groups.map(([, group]) => group)
        }
    }

    // stats
    const classMask = getTransmogClassMask(stores.settings)
    const masochist = stores.settings.transmog.completionistMode

    const seen: Record<string, boolean> = {}
    const stats: Record<string, UserCount> = {}
    const userHas: Record<string, boolean> = {}

    const overallStats = stats['OVERALL'] = new UserCount()

    const unavailableIllusions: number[] = []
    for (const illusionGroup of stores.manualData.illusions) {
        if (illusionGroup.name.startsWith('Unavailable')) {
            for (const illusionItem of illusionGroup.items) {
                unavailableIllusions.push(illusionItem.enchantmentId)
            }
        }
    }

    for (const categories of stores.manualData.vendors.sets) {
        if (categories === null) {
            continue
        }

        const baseStats = stats[categories[0].slug] = new UserCount()

        for (const category of categories.slice(1)) {
            if (category === null) {
                continue
            }

            const catKey = `${categories[0].slug}--${category.slug}`
            const catStats = stats[catKey] = new UserCount()

            for (let groupIndex = 0; groupIndex < category.groups.length; groupIndex++) {
                const group = category.groups[groupIndex]
                group.sellsFiltered = []

                if (!stores.vendorState.showPvp && pvpRegex.test(group.name)) {
                    continue
                }
                if (!stores.vendorState.showTier && tierRegex.test(group.name)) {
                    continue
                }

                const groupKey = `${catKey}--${groupIndex}`
                const groupStats = stats[groupKey] = new UserCount()

                const appearanceMap: Record<number, ManualDataVendorItem> = {}

                for (const item of group.sells) {
                    item.sortedCosts = getCurrencyCosts(stores.itemData, stores.staticData, item.costs)

                    // Skip items, they're not collectible
                    if (item.type === RewardType.Item) {
                        continue
                    }

                    if (item.classMask > 0 && (item.classMask & classMask) === 0) {
                        continue
                    }

                    const sharedItem = stores.itemData.items[item.id]

                    if (masochist) {
                        item.extraAppearances = 0
                    }
                    else if (transmogTypes.indexOf(item.type) >= 0) {
                        const appearanceId = item.appearanceIds?.length === 1
                            ? item.appearanceIds[0]
                            : sharedItem?.appearances?.[0]?.appearanceId || 0
                        if (appearanceId) {
                            const existingItem = appearanceMap[appearanceId]
                            if (existingItem) {
                                existingItem.extraAppearances++

                                if (existingItem.faction !== Faction.Both && item.faction !== existingItem.faction) {
                                    existingItem.faction = Faction.Both
                                }

                                continue
                            }
                            else {
                                appearanceMap[appearanceId] = item
                                item.extraAppearances = 0
                            }
                        }
                    }

                    const hasDrop = userHasDrop(
                        stores.itemData,
                        stores.userData,
                        stores.userQuestData,
                        stores.userTransmogData,
                        item.type,
                        item.id,
                        item.appearanceIds
                    )
                    
                    // Skip unavailable illusions
                    if (
                        item.type === RewardType.Illusion &&
                        item.appearanceIds?.length > 0 &&
                        unavailableIllusions.indexOf(item.appearanceIds[0]) >= 0 &&
                        !hasDrop
                    ) {
                        continue
                    }

                    // Skip filtered things
                    if (
                        (item.type === RewardType.Illusion && !stores.vendorState.showIllusions) ||
                        (item.type === RewardType.Mount && !stores.vendorState.showMounts) ||
                        (item.type === RewardType.Pet && !stores.vendorState.showPets) ||
                        (item.type === RewardType.Toy && !stores.vendorState.showToys) ||
                        (item.type === RewardType.Armor &&
                            (item.subType === 1 && !stores.vendorState.showCloth) ||
                            (item.subType === 2 && !stores.vendorState.showLeather) ||
                            (item.subType === 3 && !stores.vendorState.showMail) ||
                            (item.subType === 4 && !stores.vendorState.showPlate)
                        ) ||
                        (item.type === RewardType.Weapon && !stores.vendorState.showWeapons) ||
                        (sharedItem?.inventoryType === InventoryType.Back && !stores.vendorState.showCloaks)
                    ) {
                        continue
                    }

                    const thingKey = `${item.type}|${item.id}|${(item.bonusIds || []).join(',')}`

                    if (!seen[thingKey]) {
                        overallStats.total++
                    }
                    baseStats.total++
                    catStats.total++
                    groupStats.total++

                    if (hasDrop) {
                        if (!seen[thingKey]) {
                            overallStats.have++
                        }
                        baseStats.have++
                        catStats.have++
                        groupStats.have++

                        userHas[thingKey] = true
                    }

                    seen[thingKey] = true

                    if (hasDrop && !stores.vendorState.showCollected) {
                        continue
                    }
                    if (!hasDrop && !stores.vendorState.showUncollected) {
                        continue
                    }

                    group.sellsFiltered.push(item)
                } // item of group.sells

                group.stats = groupStats
            } // group of category.groups
        }
    }

    console.timeEnd('LazyStore.doVendors')

    return {
        stats,
        userHas,
    }
}
