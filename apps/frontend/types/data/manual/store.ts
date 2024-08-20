import type { ManualDataCustomizationCategory, ManualDataCustomizationCategoryArray } from './customization'
import type { ManualDataHeirloomGroup, ManualDataHeirloomGroupArray } from './heirloom'
import type { ManualDataIllusionGroup, ManualDataIllusionGroupArray } from './illusion'
import type { ManualDataProgressCategory } from './progress'
import type { ManualDataSetCategory, ManualDataSetCategoryArray } from './set'
import type { ManualDataSharedVendor, ManualDataSharedVendorArray } from './shared-vendor'
import type { ManualDataTransmogCategory, ManualDataTransmogCategoryArray } from './transmog'
import type { ManualDataVendorCategory, ManualDataVendorCategoryArray } from './vendor'
import type { ManualDataZoneMapCategory, ManualDataZoneMapCategoryArray } from './zone-map'


export interface ManualData {
    // TODO pack these
    progressSets: ManualDataProgressCategory[][]

    // Packed data
    rawSharedVendors: ManualDataSharedVendorArray[]

    rawMountSets: ManualDataSetCategoryArray[][]
    rawPetSets: ManualDataSetCategoryArray[][]
    rawToySets: ManualDataSetCategoryArray[][]
    
    rawCustomizationCategories: ManualDataCustomizationCategoryArray[][]
    rawHeirloomGroups: ManualDataHeirloomGroupArray[]
    rawIllusionGroups: ManualDataIllusionGroupArray[]
    rawTransmogSets: ManualDataTransmogCategoryArray[][]
    rawVendorSets: ManualDataVendorCategoryArray[]
    rawZoneMapSets: ManualDataZoneMapCategoryArray[][]

    rawTags: [number, string][]

    // Computed data
    dragonridingItemToQuest: Record<number, number>
    druidFormItemToQuest: Record<number, number>
    heirlooms: ManualDataHeirloomGroup[]
    illusions: ManualDataIllusionGroup[]
    shared: ManualDataShared
    transmog: ManualDataTransmog
    vendors: ManualDataVendors
    zoneMaps: ManualDataZoneMaps

    customizationCategories: ManualDataCustomizationCategory[][]
    mountSets: ManualDataSetCategory[][]
    petSets: ManualDataSetCategory[][]
    toySets: ManualDataSetCategory[][]

    tagsById: Record<number, string>
    tagsByName: Record<string, number>
}

export interface ManualDataShared {
    vendors: Record<number, ManualDataSharedVendor>
    vendorsByMap: Record<string, number[]>
    vendorsByTag: Record<string, number[]>
}

export interface ManualDataTransmog {
    sets: ManualDataTransmogCategory[][]
}

export interface ManualDataVendors {
    sets: ManualDataVendorCategory[]
}

export interface ManualDataZoneMaps {
    sets: ManualDataZoneMapCategory[][]
}
