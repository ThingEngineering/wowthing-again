import { Faction } from '@/enums/faction';
import { getCurrencyCostsString } from '@/utils/get-currency-costs';
import type { ItemQuality } from '@/enums/item-quality';
import { RewardType } from '@/enums/reward-type';
import type { UserCount } from '@/types';
import type { ItemData } from '@/types/data/item';
import type { StaticData } from '@/shared/stores/static/types/store';
import { LookupType } from '@/enums/lookup-type';
import type { ManualData } from './store';

export class ManualDataVendorCategory {
    public groups: ManualDataVendorGroup[];

    constructor(
        public name: string,
        public slug: string,
        groupArrays: ManualDataVendorGroupArray[],
        public vendorMaps: string[],
        public vendorTags: string[],
    ) {
        this.groups = groupArrays.map((groupArray) => new ManualDataVendorGroup(...groupArray));
    }
}
export type ManualDataVendorCategoryArray = ConstructorParameters<typeof ManualDataVendorCategory>;

export class ManualDataVendorGroup {
    public sells: ManualDataVendorItem[];
    public sellsFiltered: ManualDataVendorItem[];
    public stats: UserCount;

    constructor(
        public name: string,
        itemArrays: ManualDataVendorItemArray[],
        public auto?: boolean,
    ) {
        this.sells = itemArrays.map((itemArray) => new ManualDataVendorItem(...itemArray));
    }
}
export type ManualDataVendorGroupArray = ConstructorParameters<typeof ManualDataVendorGroup>;

export class ManualDataVendorItem {
    public costs: Record<number, number>;
    public extraAppearances: number;
    public faction: Faction = Faction.Both;
    public sortedCosts: [string, number, string, number, number][];

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
        public note?: string,
    ) {
        this.costs = {};
        if (costArrays) {
            for (const costArray of costArrays) {
                this.costs[costArray[0]] = costArray[1];
            }
        }
    }

    getNote(itemData: ItemData, staticData: StaticData): string | undefined {
        return this.costs
            ? getCurrencyCostsString(itemData, staticData, this.costs, this.reputation)
            : this.note;
    }

    private _lookupType?: LookupType;
    private _lookupId?: number;
    getLookupData(
        itemData: ItemData,
        manualData: ManualData,
        staticData: StaticData,
    ): [LookupType, number] {
        let ret: [LookupType, number] = [this._lookupType, this._lookupId];
        if (!ret[0]) {
            if (this.type === RewardType.Item) {
                if (staticData.mountsByItem[this.id]) {
                    ret = [LookupType.Mount, staticData.mountsByItem[this.id].id];
                } else if (itemData.completesQuest[this.id]) {
                    ret = [LookupType.Quest, this.id];
                } else if (manualData.dragonridingItemToQuest[this.id]) {
                    ret = [LookupType.Quest, manualData.dragonridingItemToQuest[this.id]];
                } else if (manualData.druidFormItemToQuest[this.id]) {
                    ret = [LookupType.Quest, manualData.druidFormItemToQuest[this.id]];
                } else if (staticData.toys[this.id]) {
                    ret = [LookupType.Toy, this.id];
                }
            }

            if (ret[0]) {
                this._lookupType = ret[0];
                this._lookupId = ret[1];
            }
        }
        return ret;
    }
}
export type ManualDataVendorItemArray = ConstructorParameters<typeof ManualDataVendorItem>;
