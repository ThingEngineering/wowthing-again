import type { RewardType } from '@/enums/reward-type';
import type {
    ManualDataCustomizationCategory,
    ManualDataCustomizationCategoryArray,
} from './customization';
import type { ManualDataHeirloomGroup, ManualDataHeirloomGroupArray } from './heirloom';
import type { ManualDataIllusionGroup, ManualDataIllusionGroupArray } from './illusion';
import type { ManualDataProgressCategory } from './progress';
import type { ManualDataSetCategory, ManualDataSetCategoryArray } from './set';
import type { ManualDataSharedVendor, ManualDataSharedVendorArray } from './shared-vendor';
import type { ManualDataTransmogCategory, ManualDataTransmogCategoryArray } from './transmog';
import type { ManualDataVendorCategory, ManualDataVendorCategoryArray } from './vendor.svelte';
import type { ManualDataZoneMapCategory, ManualDataZoneMapCategoryArray } from './zone-map';

export interface ManualData {
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

    // Computed data
    dragonridingItemToQuest: Record<number, number>;
    druidFormItemToQuest: Record<number, number>;
    heirlooms: ManualDataHeirloomGroup[];
    illusions: ManualDataIllusionGroup[];
    reputationSets: ManualDataReputationCategory[];
    shared: ManualDataShared;
    transmog: ManualDataTransmog;
    vendors: ManualDataVendors;
    zoneMaps: ManualDataZoneMaps;

    customizationCategories: ManualDataCustomizationCategory[][];
    mountSets: ManualDataSetCategory[][];
    petSets: ManualDataSetCategory[][];
    toySets: ManualDataSetCategory[][];

    tagsById: Record<number, string>;
    tagsByName: Record<string, number>;
}

export interface ManualDataShared {
    vendors: Record<number, ManualDataSharedVendor>;
    vendorsByMap: Record<string, number[]>;
    vendorsByTag: Record<string, number[]>;
}

export interface ManualDataTransmog {
    sets: ManualDataTransmogCategory[][];
}

export interface ManualDataVendors {
    sets: ManualDataVendorCategory[];
}

export interface ManualDataZoneMaps {
    sets: ManualDataZoneMapCategory[][];
}

export class ManualDataReputationCategory {
    public reputations: ManualDataReputationSet[][];

    constructor(
        public name: string,
        public slug: string,
        reputationArrays: ManualDataReputationSetArray[][],
        public minimumLevel?: number,
    ) {
        this.reputations = reputationArrays.map((repGroup) =>
            repGroup.map((repSet) => new ManualDataReputationSet(...repSet)),
        );
    }
}
export type ManualDataReputationCategoryArray = ConstructorParameters<
    typeof ManualDataReputationCategory
>;

export class ManualDataReputationSet {
    public both: ManualDataReputationReputation;
    public alliance: ManualDataReputationReputation;
    public horde: ManualDataReputationReputation;

    constructor(
        public paragon: boolean,
        reputationArrays: ManualDataReputationReputationArray[],
    ) {
        for (const reputationArray of reputationArrays) {
            const obj = new ManualDataReputationReputation(...reputationArray);
            if (reputationArray[0] === 'both') {
                this.both = obj;
            } else if (reputationArray[0] === 'alliance') {
                this.alliance = obj;
            } else if (reputationArray[0] === 'horde') {
                this.horde = obj;
            }
        }
    }
}
export type ManualDataReputationSetArray = ConstructorParameters<typeof ManualDataReputationSet>;

export class ManualDataReputationReputation {
    public rewards: ManualDataReputationReward[];

    constructor(
        key: string,
        public id: number,
        public icon: string,
        public iconText: string,
        rewards: ManualDataReputationRewardArray[],
        public note?: string,
    ) {
        this.rewards = rewards.map((rewardArray) => new ManualDataReputationReward(...rewardArray));
    }
}
export type ManualDataReputationReputationArray = ConstructorParameters<
    typeof ManualDataReputationReputation
>;

export class ManualDataReputationReward {
    constructor(
        public type: RewardType,
        public id: number,
    ) {}
}
export type ManualDataReputationRewardArray = ConstructorParameters<
    typeof ManualDataReputationReward
>;
