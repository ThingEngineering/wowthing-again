import { Faction } from '@/enums/faction';
import { RewardType } from '@/enums/reward-type';
import { getCurrencyCostsString } from '@/utils/get-currency-costs';
import type { ItemQuality } from '@/enums/item-quality';
import type { UserCount } from '@/types';

export type ManualDataVendorCategoryArray = [
    name: string,
    slug: string,
    groupArrays: ManualDataVendorGroupArray[],
    vendorMaps: string[],
    vendorSets: string[],
    vendorTags: string[],
    childArrays: ManualDataVendorCategoryArray[],
];

export class ManualDataVendorCategory {
    public children: ManualDataVendorCategory[];
    public groups: ManualDataVendorGroup[];
    public vendorIds: number[];

    constructor(
        public name: string,
        public slug: string,
        groupArrays: ManualDataVendorGroupArray[],
        public vendorMaps: string[],
        public vendorSets: string[],
        public vendorTags: string[],
        childArrays: ManualDataVendorCategoryArray[]
    ) {
        this.groups = groupArrays.map((groupArray) => new ManualDataVendorGroup(...groupArray));
        this.children = childArrays.map((childArray) =>
            childArray === null ? null : new ManualDataVendorCategory(...childArray)
        );
    }
}
// Can't use this and have it reference itself, alas
// export type ManualDataVendorCategoryArray = ConstructorParameters<typeof ManualDataVendorCategory>;

export class ManualDataVendorGroup {
    public sells: ManualDataVendorItem[];
    public sellsFiltered: ManualDataVendorItem[] = $state([]);
    public stats: UserCount;

    constructor(
        public name: string,
        itemArrays: ManualDataVendorItemArray[],
        public auto?: boolean,
        public showNormalTag?: boolean
    ) {
        this.sells = itemArrays.map((itemArray) => new ManualDataVendorItem(...itemArray));
    }
}
export type ManualDataVendorGroupArray = ConstructorParameters<typeof ManualDataVendorGroup>;

export class ManualDataVendorItem {
    public appearanceModifier: number = 0;
    public costs: Record<number, number>;
    public extraAppearances: number;
    public faction: Faction = Faction.Both;
    public sortedCosts: [string, number, string, number, number][];
    public trackingQuestId: number;

    constructor(
        public id: number,
        public type: RewardType,
        public subType: number,
        public quality: ItemQuality,
        public classMask: number,
        costArrays?: number[][],
        public reputation?: number[],
        public appearanceIds?: number[],
        public bonusIds?: number[],
        public note?: string
    ) {
        this.costs = {};
        if (costArrays) {
            for (const costArray of costArrays) {
                this.costs[costArray[0]] = costArray[1];
            }
        }
    }

    getNote(): string | undefined {
        return this.costs ? getCurrencyCostsString(this.costs, this.reputation) : this.note;
    }
}
export type ManualDataVendorItemArray = ConstructorParameters<typeof ManualDataVendorItem>;
