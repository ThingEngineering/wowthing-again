import type { RewardType } from '@/types/enums'
import type { UserCount } from '@/types/user-count'
import type { FarmStatus } from '@/types/zone-maps'

import type { ManualDataSharedItem, ManualDataSharedItemArray } from './item'
import type { ManualDataProgressCategory } from './progress'
import type { ManualDataSetCategory, ManualDataSetCategoryArray } from './set'
import type { ManualDataSharedVendor, ManualDataSharedVendorArray } from './vendor'
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

    rawVendorSets: ManualDataVendorCategoryArray[][]
    rawZoneMapSets: ManualDataZoneMapCategoryArray[][]

    // Computed data
    shared: ManualDataShared
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
