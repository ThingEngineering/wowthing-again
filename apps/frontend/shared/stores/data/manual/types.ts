import type {
    ManualDataCustomizationCategory,
    ManualDataCustomizationCategoryArray,
    ManualDataHeirloomGroup,
    ManualDataHeirloomGroupArray,
    ManualDataIllusionGroup,
    ManualDataIllusionGroupArray,
    ManualDataReputationCategory,
    ManualDataReputationCategoryArray,
    ManualDataSetCategory,
    ManualDataSetCategoryArray,
    ManualDataShared,
    ManualDataSharedVendorArray,
    ManualDataTransmog,
    ManualDataTransmogCategoryArray,
    ManualDataVendorCategoryArray,
    ManualDataVendors,
    ManualDataZoneMapCategoryArray,
    ManualDataZoneMaps,
} from '@/types/data/manual';

export interface RawManual {
    // Packed data
    rawSharedVendors: ManualDataSharedVendorArray[];

    rawMountSets: ManualDataSetCategoryArray[][];
    rawPetSets: ManualDataSetCategoryArray[][];
    rawToySets: ManualDataSetCategoryArray[][];

    rawCustomizationCategories: ManualDataCustomizationCategoryArray[][];
    rawHeirloomGroups: ManualDataHeirloomGroupArray[];
    rawIllusionGroups: ManualDataIllusionGroupArray[];
    rawReputationSets: ManualDataReputationCategoryArray[];
    rawTransmogSets: ManualDataTransmogCategoryArray[][];
    rawVendorSets: ManualDataVendorCategoryArray[];
    rawZoneMapSets: ManualDataZoneMapCategoryArray[][];

    rawTags: [number, string][];
}

export class DataManual {
    // move to items
    dragonridingItemToQuest: Map<number, number> = new Map();
    druidFormItemToQuest: Map<number, number> = new Map();

    tagsById: Map<number, string> = new Map();
    tagsByName: Map<string, number> = new Map();

    heirlooms: ManualDataHeirloomGroup[] = [];
    illusions: ManualDataIllusionGroup[] = [];
    shared: ManualDataShared = { vendors: {}, vendorsByMap: {}, vendorsByTag: {} };
    transmog: ManualDataTransmog = { sets: [] };
    vendors: ManualDataVendors = { sets: [] };
    zoneMaps: ManualDataZoneMaps = { sets: [] };

    mountSets: ManualDataSetCategory[][] = [];
    petSets: ManualDataSetCategory[][] = [];
    toySets: ManualDataSetCategory[][] = [];

    customizationCategories: ManualDataCustomizationCategory[][];
    reputationSets: ManualDataReputationCategory[];
}
