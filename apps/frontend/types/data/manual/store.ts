import type { ManualDataDragonridingCategory } from './dragonriding'
import type { ManualDataDruidFormGroup, ManualDataDruidFormGroupArray } from './druid-form'
import type { ManualDataHeirloomGroup, ManualDataHeirloomGroupArray } from './heirloom'
import type { ManualDataIllusionGroup, ManualDataIllusionGroupArray } from './illusion'
import type { ManualDataProgressCategory } from './progress'
import type { ManualDataSetCategory, ManualDataSetCategoryArray } from './set'
import type { ManualDataSharedItemSet, ManualDataSharedItemSetArray } from './shared-item-set'
import type { ManualDataSharedVendor, ManualDataSharedVendorArray } from './shared-vendor'
import type { ManualDataTransmogCategory, ManualDataTransmogCategoryArray } from './transmog'
import type { ManualDataVendorCategory, ManualDataVendorCategoryArray } from './vendor'
import type { ManualDataZoneMapCategory, ManualDataZoneMapCategoryArray } from './zone-map'


export interface ManualData {
    // TODO pack these
    dragonriding: ManualDataDragonridingCategory[]
    progressSets: ManualDataProgressCategory[][]

    // Packed data
    rawSharedItemSets: ManualDataSharedItemSetArray[]
    rawSharedVendors: ManualDataSharedVendorArray[]

    rawMountSets: ManualDataSetCategoryArray[][]
    rawPetSets: ManualDataSetCategoryArray[][]
    rawToySets: ManualDataSetCategoryArray[][]
    
    rawDruidFormGroups: ManualDataDruidFormGroupArray[]
    rawHeirloomGroups: ManualDataHeirloomGroupArray[]
    rawIllusionGroups: ManualDataIllusionGroupArray[]
    rawTransmogSets: ManualDataTransmogCategoryArray[][]
    rawVendorSets: ManualDataVendorCategoryArray[][]
    rawZoneMapSets: ManualDataZoneMapCategoryArray[][]

    rawTags: [number, string][]

    // Computed data
    dragonridingItemToQuest: Record<number, number>
    druidForms: ManualDataDruidFormGroup[]
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
}

export interface ManualDataVendors {
    sets: ManualDataVendorCategory[][]
}

export interface ManualDataZoneMaps {
    sets: ManualDataZoneMapCategory[][]
}
