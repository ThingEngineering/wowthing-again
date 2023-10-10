import sortBy from 'lodash/sortBy'

import { WritableFancyStore } from '@/types/fancy-store'
import {
    ManualDataHeirloomGroup,
    ManualDataIllusionGroup,
    ManualDataSetCategory,
    ManualDataSharedItemSet,
    ManualDataSharedVendor,
    ManualDataTransmogCategory,
    ManualDataTransmogSetCategory,
    ManualDataVendorCategory,
    ManualDataZoneMapCategory,
} from '@/types/data/manual'
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
}

export const manualStore = new ManualDataStore()
