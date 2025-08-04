import type {
    ManualDataCustomizationCategory,
    ManualDataCustomizationCategoryArray,
    ManualDataHeirloomGroup,
    ManualDataHeirloomGroupArray,
    ManualDataIllusionGroup,
    ManualDataIllusionGroupArray,
    ManualDataProgressCategory,
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
    // TODO pack these
    progressSets: ManualDataProgressCategory[][];

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
    delversItemToQuest: Map<number, number> = new Map();
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
    progressSets: ManualDataProgressCategory[][];
    reputationSets: ManualDataReputationCategory[];
}
