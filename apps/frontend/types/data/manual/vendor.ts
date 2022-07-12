import type { RewardType, ItemQuality } from '@/types/enums'


export class ManualDataVendorCategory {
    public groups: ManualDataVendorGroup[]

    constructor(
        public name: string,
        public slug: string,
        groupArrays: ManualDataVendorGroupArray[]
    )
    {
        this.groups = groupArrays.map((groupArray) => new ManualDataVendorGroup(...groupArray))
    }
}
export type ManualDataVendorCategoryArray = ConstructorParameters<typeof ManualDataVendorCategory>

export class ManualDataVendorGroup {
    public sells: ManualDataVendorItem[]
    public sellsFiltered: ManualDataVendorItem[]

    constructor(
        public name: string,
        public type: RewardType,
        itemArrays: ManualDataVendorItemArray[],
    )
    {
        this.sells = itemArrays.map((itemArray) => new ManualDataVendorItem(...itemArray))
    }
}
export type ManualDataVendorGroupArray = ConstructorParameters<typeof ManualDataVendorGroup>

export class ManualDataVendorItem {
    public costs: Record<string, number>

    constructor(
        public id: number,
        public quality: ItemQuality,
        public classMask: number,
        costs: [string, number][],
        public appearanceId?: number
    )
    {
        this.costs = Object.fromEntries(costs)
    }
}
export type ManualDataVendorItemArray = ConstructorParameters<typeof ManualDataVendorItem>
