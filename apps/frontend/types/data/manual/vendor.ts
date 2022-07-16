import { getCurrencyCostsString } from '@/utils/get-currency-costs'
import type { RewardType, ItemQuality } from '@/types/enums'
import type { ManualData } from './store'


export class ManualDataVendorCategory {
    public groups: ManualDataVendorGroup[]

    constructor(
        public name: string,
        public slug: string,
        groupArrays: ManualDataVendorGroupArray[],
        public vendorMaps: string[],
        public vendorTags: string[]
    )
    {
        this.groups = groupArrays.map((groupArray) => new ManualDataVendorGroup(...groupArray))
    }
}
export type ManualDataVendorCategoryArray = ConstructorParameters<typeof ManualDataVendorCategory>

export class ManualDataVendorGroup {
    public sells: ManualDataVendorItem[]
    public sellsFiltered: ManualDataVendorItem[]
    public auto?: boolean

    constructor(
        public name: string,
        itemArrays: ManualDataVendorItemArray[],
    )
    {
        this.sells = itemArrays.map((itemArray) => new ManualDataVendorItem(...itemArray))
    }
}
export type ManualDataVendorGroupArray = ConstructorParameters<typeof ManualDataVendorGroup>

export class ManualDataVendorItem {
    public costs: Record<number, number>

    constructor(
        public id: number,
        public type: RewardType,
        public subType: number,
        public quality: ItemQuality,
        public classMask: number,
        costArrays?: number[][],
        public reputation?: number[],
        public appearanceId?: number,
        public bonusIds?: number[],
        public note?: string
    )
    {
        this.costs = {}
        if (costArrays) {
            for (const costArray of costArrays) {
                this.costs[costArray[0]] = costArray[1]
            }
        }
    }
    
    getNote(manualData: ManualData): string | undefined {
        return this.costs ? getCurrencyCostsString(manualData, this.costs, this.reputation) : this.note
    }
}
export type ManualDataVendorItemArray = ConstructorParameters<typeof ManualDataVendorItem>
