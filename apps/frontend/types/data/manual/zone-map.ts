import type { FarmAnchorPoint } from '@/enums/farm-anchor-point';
import type { FarmIdType } from '@/enums/farm-id-type';
import type { FarmResetType } from '@/enums/farm-reset-type';
import type { FarmType } from '@/enums/farm-type';
import type { RewardType } from '@/enums/reward-type';
import type { ManualDataVendorItem } from './vendor.svelte';

export class ManualDataZoneMapCategory {
    public farms: ManualDataZoneMapFarm[];

    constructor(
        public name: string,
        public slug: string,
        public mapName: string,
        public minimumLevel: number,
        public requiredQuestIds: number[],
        farmArrays: ManualDataZoneMapFarmArray[],
        public wowheadGuide?: string,
    ) {
        this.farms = farmArrays.map((farmArray) => new ManualDataZoneMapFarm(...farmArray));
    }
}
export type ManualDataZoneMapCategoryArray = ConstructorParameters<
    typeof ManualDataZoneMapCategory
>;

export class ManualDataZoneMapFarm {
    public drops: ManualDataZoneMapDrop[];
    public highlightQuestId?: number;
    public location: string[];
    public worldQuestId?: number;

    constructor(
        public type: FarmType,
        public reset: FarmResetType,
        public idType: FarmIdType,
        public id: number,
        public name: string,
        location: string,
        public questIds: number[],
        dropArrays: ManualDataZoneMapDropArray[],
        public minimumLevel?: number,
        public statisticId?: number,
        public requiredQuestIds?: number[],
        public criteriaId?: number,
        public note?: string,
        public faction?: string,
        public groupId?: number,
        public anchorPoint?: FarmAnchorPoint,
    ) {
        this.location = location.split(',');
        this.drops = dropArrays.map((dropArray) => new ManualDataZoneMapDrop(...dropArray));
    }
}
export type ManualDataZoneMapFarmArray = ConstructorParameters<typeof ManualDataZoneMapFarm>;

export class ManualDataZoneMapDrop {
    public appearanceIds?: number[][];
    public costs?: Record<number, number>[];
    public vendorItems?: ManualDataVendorItem[];

    constructor(
        public id: number,
        public type: RewardType,
        public subType: number,
        public classMask: number,
        public limit?: string[],
        public questIds?: number[],
        public requiredQuestId?: number,
        public amount?: number,
        public note?: string,
    ) {}
}
export type ManualDataZoneMapDropArray = ConstructorParameters<typeof ManualDataZoneMapDrop>;
