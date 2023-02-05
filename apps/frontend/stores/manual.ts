import sortBy from 'lodash/sortBy'
import { get } from 'svelte/store'

import { itemStore, staticStore } from '@/stores'
import { WritableFancyStore } from '@/types'
import {
    ManualDataHeirloomGroup,
    ManualDataIllusionGroup,
    ManualDataSetCategory,
    ManualDataSharedItemSet,
    ManualDataSharedVendor,
    ManualDataTransmogCategory,
    ManualDataTransmogSetCategory,
    ManualDataVendorCategory,
    ManualDataVendorGroup,
    ManualDataVendorItem,
    ManualDataZoneMapCategory,
} from '@/types/data/manual'
import { Faction, PlayableClassMask, RewardType } from '@/enums'
import { getCurrencyCosts } from '@/utils/get-currency-costs'
import type { FancyStoreType } from '@/types'
import type { ManualData, ManualDataSetCategoryArray } from '@/types/data/manual'


export class ManualDataStore extends WritableFancyStore<ManualData> {
    get dataUrl(): string {
        return document.getElementById('app').getAttribute('data-manual')
    }

    initialize(data: ManualData): void {
        console.time('ManualDataStore.initialize')

        data.shared = {
            itemSets: [],
            itemSetsByTag: {},

            vendors: {},
            vendorsByMap: {},
            vendorsByTag: {},
        }
        data.tagsById = {}
        data.tagsByName = {}
        data.transmog = {
            sets: [],
            setsV2: [],
        }
        data.vendors = {
            sets: [],
        }
        data.zoneMaps = {
            sets: [],
        }

        for (const [tagId, tagName] of data.rawTags) {
            data.tagsById[tagId] = tagName
            data.tagsByName[tagName] = tagId
        }
        data.rawTags = null

        for (const itemSetArray of data.rawSharedItemSets) {
            const obj = new ManualDataSharedItemSet(...itemSetArray)
            data.shared.itemSets.push(obj)

            for (const tag of obj.tags) {
                data.shared.itemSetsByTag[tag] ||= []
                data.shared.itemSetsByTag[tag].push(obj)
            }
        }
        data.rawSharedItemSets = null

        for (const vendorArray of data.rawSharedVendors) {
            const obj = new ManualDataSharedVendor(...vendorArray)
            data.shared.vendors[obj.id] = obj
            
            for (const mapName of Object.keys(obj.locations)) {
                data.shared.vendorsByMap[mapName] ||= []
                data.shared.vendorsByMap[mapName].push(obj.id)
            }

            for (const tag of obj.tags) {
                data.shared.vendorsByTag[tag] ||= []
                data.shared.vendorsByTag[tag].push(obj.id)
            }
        }
        data.rawSharedVendors = null

        data.heirlooms = data.rawHeirloomGroups.map(
            (groupArray) => new ManualDataHeirloomGroup(...groupArray)
        )
        data.rawHeirloomGroups = null

        data.illusions = data.rawIllusionGroups.map(
            (groupArray) => new ManualDataIllusionGroup(...groupArray)
        )
        data.rawIllusionGroups = null

        data.transmog.sets = data.rawTransmogSets.map(
            (categories) => categories === null ? null : categories.map(
                (catArray) => catArray === null ? null : new ManualDataTransmogCategory(...catArray)
            )
        )
        data.rawTransmogSets = null

        data.transmog.setsV2 = data.rawTransmogSetsV2.map(
            (categories) => categories === null ? null : categories.map(
                (catArray) => catArray === null ? null : new ManualDataTransmogSetCategory(...catArray)
            )
        )
        data.rawTransmogSetsV2 = null

        data.vendors.sets = data.rawVendorSets.map(
            (categories) => categories === null ? null : categories.map(
                (catArray) => catArray === null ? null : new ManualDataVendorCategory(...catArray)
            )
        )
        data.rawVendorSets = null

        data.zoneMaps.sets = data.rawZoneMapSets.map(
            (categories) => categories === null ? null : categories.map(
                (catArray) => catArray === null ? null : new ManualDataZoneMapCategory(...catArray)
            )
        )
        data.rawZoneMapSets = null

        data.mountSets = this.fixCollectionSets(data.rawMountSets)
        data.petSets = this.fixCollectionSets(data.rawPetSets)
        data.toySets = this.fixCollectionSets(data.rawToySets)
        
        data.transmog.sets = this.fixTransmogSets(data.transmog.sets)
        data.transmog.setsV2 = this.fixTransmogSetsV2(data.transmog.setsV2)

        data.rawMountSets = null
        data.rawPetSets = null
        data.rawToySets = null
        
        console.timeEnd('ManualDataStore.initialize')
    }
    
    private fixCollectionSets(
        allSets: ManualDataSetCategoryArray[][]
    ): ManualDataSetCategory[][] {
        const newSets: ManualDataSetCategory[][] = []

        for (const sets of allSets) {
            if (sets === null) {
                newSets.push(null)
                continue
            }

            const actualSets = sets.map(
                (set) => new ManualDataSetCategory(...set)
            )

            newSets.push(
                sortBy(
                    actualSets,
                    (set) => [
                        set.name.startsWith('<') ? 0 : 1,
                        set.name.startsWith('>') ? 1 : 0,
                    ]
                )
            )

            for (const set of newSets[newSets.length - 1]) {
                if (set.name.startsWith('<') || set.name.startsWith('>')) {
                    set.name = set.name.substring(1)
                }
            }
        }

        return newSets
    }
    
    private fixTransmogSets(
        allSets: ManualDataTransmogCategory[][]
    ): ManualDataTransmogCategory[][] {
        const newSets: ManualDataTransmogCategory[][] = []

        for (const sets of allSets) {
            if (sets === null) {
                newSets.push(null)
            }
            else {
                newSets.push(
                    sortBy(
                        sets,
                        (set) => [
                            set.name.startsWith('<') ? 0 : 1,
                            set.name.startsWith('>') ? 1 : 0,
                        ]
                    )
                )

                for (const set of newSets[newSets.length - 1]) {
                    if (set.name.startsWith('<') || set.name.startsWith('>')) {
                        set.name = set.name.substring(1)
                    }
                }
            }
        }

        return newSets
    }

    private fixTransmogSetsV2(
        allSets: ManualDataTransmogSetCategory[][]
    ): ManualDataTransmogSetCategory[][] {
        const newSets: ManualDataTransmogSetCategory[][] = []

        for (const sets of allSets) {
            if (sets === null) {
                newSets.push(null)
            }
            else {
                newSets.push(
                    sortBy(
                        sets,
                        (set) => [
                            set.name.startsWith('<') ? 0 : 1,
                            set.name.startsWith('>') ? 1 : 0,
                        ]
                    )
                )

                for (const set of newSets[newSets.length - 1]) {
                    if (set.name.startsWith('<') || set.name.startsWith('>')) {
                        set.name = set.name.substring(1)
                    }
                }
            }
        }

        return newSets
    }

    setup(): void {
        console.time('ManualDataStore.setup')

        this.update(state => {
            console.time('ManualDataStore.setupVendors')
            this.setupVendors(state)
            console.timeEnd('ManualDataStore.setupVendors')
            
            return state
        })

        console.timeEnd('ManualDataStore.setup')
    }

    private setupVendors(
        state: FancyStoreType<ManualData>
    )
    {
        const itemData = get(itemStore)
        const staticData = get(staticStore)
        // console.time('setupVendors')

        for (const vendor of Object.values(state.shared.vendors)) {
            vendor.createFarmData(itemData, state, staticData)
        }

        for (const categories of state.vendors.sets) {
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
                    vendorIds.push(...(state.shared.vendorsByMap[mapName] || []))
                }
                for (const tagName of category.vendorTags) {
                    vendorIds.push(...(state.shared.vendorsByTag[tagName] || []))
                }

                const autoGroups: Record<string, ManualDataVendorGroup> = {}

                for (const vendorId of vendorIds) {
                    const vendor = state.shared.vendors[vendorId]

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
                        item.sortedCosts = getCurrencyCosts(itemData, staticData, item.costs)

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

        // console.timeEnd('setupVendors')
    }
}

export const manualStore = new ManualDataStore()
