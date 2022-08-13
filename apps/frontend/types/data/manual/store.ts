import type { RewardType } from '@/types/enums'
import type { UserCount } from '@/types/user-count'
import type { FarmStatus } from '@/types/zone-maps'

import type { ManualDataHeirloomGroup, ManualDataHeirloomGroupArray } from './heirloom'
import type { ManualDataIllusionGroup, ManualDataIllusionGroupArray } from './illusion'
import type { ManualDataProgressCategory } from './progress'
import type { ManualDataSetCategory, ManualDataSetCategoryArray } from './set'
import type { ManualDataSharedItem, ManualDataSharedItemArray } from './shared-item'
import type { ManualDataSharedVendor, ManualDataSharedVendorArray } from './shared-vendor'
import type { ManualDataTransmogCategory, ManualDataTransmogCategoryArray } from './transmog'
import type { ManualDataVendorCategory, ManualDataVendorCategoryArray } from './vendor'
import type { ManualDataZoneMapCategory, ManualDataZoneMapCategoryArray } from './zone-map'


export interface ManualData {
    // TODO pack these
    progressSets: ManualDataProgressCategory[][]

    // Packed data
    rawSharedItems: ManualDataSharedItemArray[]
    rawSharedVendors: ManualDataSharedVendorArray[]

    rawMountSets: ManualDataSetCategoryArray[][]
    rawPetSets: ManualDataSetCategoryArray[][]
    rawToySets: ManualDataSetCategoryArray[][]

    rawHeirloomGroups: ManualDataHeirloomGroupArray[]
    rawIllusionGroups: ManualDataIllusionGroupArray[]
    rawTransmogSets: ManualDataTransmogCategoryArray[][]
    rawVendorSets: ManualDataVendorCategoryArray[][]
    rawZoneMapSets: ManualDataZoneMapCategoryArray[][]

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
}

export interface ManualDataShared {
    items: Record<number, ManualDataSharedItem>
    vendors: Record<number, ManualDataSharedVendor>
    vendorsByMap: Record<string, number[]>
    vendorsByTag: Record<string, number[]>
}

export interface ManualDataTransmog {
    sets: ManualDataTransmogCategory[][]
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
