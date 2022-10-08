import type { RewardType } from '@/enums'
import type { UserCount } from '@/types/user-count'
import type { FarmStatus } from '@/types/zone-maps'

import type { ManualDataHeirloomGroup, ManualDataHeirloomGroupArray } from './heirloom'
import type { ManualDataIllusionGroup, ManualDataIllusionGroupArray } from './illusion'
import type { ManualDataProgressCategory } from './progress'
import type { ManualDataSetCategory, ManualDataSetCategoryArray } from './set'
import type { ManualDataSharedItemSet, ManualDataSharedItemSetArray } from './shared-item-set'
import type { ManualDataSharedVendor, ManualDataSharedVendorArray } from './shared-vendor'
import type { ManualDataTransmogCategory, ManualDataTransmogCategoryArray } from './transmog'
import type { ManualDataTransmogSetCategory, ManualDataTransmogSetCategoryArray } from './transmog-v2'
import type { ManualDataVendorCategory, ManualDataVendorCategoryArray } from './vendor'
import type { ManualDataZoneMapCategory, ManualDataZoneMapCategoryArray } from './zone-map'


export interface ManualData {
    // TODO pack these
    progressSets: ManualDataProgressCategory[][]

    // Packed data
    rawSharedItemSets: ManualDataSharedItemSetArray[]
    rawSharedVendors: ManualDataSharedVendorArray[]

    rawMountSets: ManualDataSetCategoryArray[][]
    rawPetSets: ManualDataSetCategoryArray[][]
    rawToySets: ManualDataSetCategoryArray[][]

    rawHeirloomGroups: ManualDataHeirloomGroupArray[]
    rawIllusionGroups: ManualDataIllusionGroupArray[]
    rawTransmogSets: ManualDataTransmogCategoryArray[][]
    rawTransmogSetsV2: ManualDataTransmogSetCategoryArray[][]
    rawVendorSets: ManualDataVendorCategoryArray[][]
    rawZoneMapSets: ManualDataZoneMapCategoryArray[][]

    rawTags: [number, string][]

    // Computed data
    heirlooms: ManualDataHeirloomGroup[]
    illusions: ManualDataIllusionGroup[]
    shared: ManualDataShared
    transmog: ManualDataTransmog
    vendors: ManualDataVendors
    zoneMaps: ManualDataZoneMaps

    mountSets: ManualDataSetCategory[][]
    petSets: ManualDataSetCategory[][]
    toySets: ManualDataSetCategory[][]

    tagsById: Record<number, string>
    tagsByName: Record<string, number>
}

export interface ManualDataShared {
    itemSets: ManualDataSharedItemSet[]
    itemSetsByTag: Record<number, ManualDataSharedItemSet[]>

    vendors: Record<number, ManualDataSharedVendor>
    vendorsByMap: Record<string, number[]>
    vendorsByTag: Record<string, number[]>
}

export interface ManualDataTransmog {
    sets: ManualDataTransmogCategory[][]
    setsV2: ManualDataTransmogSetCategory[][]
}

export interface ManualDataVendors {
    sets: ManualDataVendorCategory[][]

    counts?: Record<string, UserCount>
}

export interface ManualDataZoneMaps {
    sets: ManualDataZoneMapCategory[][]

    counts?: Record<string, UserCount>
    farmStatus?: Record<string, FarmStatus[]>
    typeCounts?: Record<string, Record<RewardType, UserCount>>
}
