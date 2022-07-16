import type { RewardType, ItemQuality } from '@/types/enums'


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
    
    getNote(): string | undefined {
        if (this.costs) {
            const parts: string[] = []
            const keys = Object.keys(this.costs).map((key) => parseInt(key))
            keys.sort()
            for (const key of keys) {
                let price: string
                if (key === 0) {
                    price = `${this.costs[key]}`
                }
                else {
                    price = `${this.costs[key]}|${key}`
                }
                
                if (this.reputation?.length === 2) {
                    parts.push(`{repPrice:${this.reputation[0]}|${this.reputation[1]}|${price}}`)
                }
                else {
                    parts.push(`{price:${price}}`)
                }
            }
            return parts.join(', ')
        }
        return this.note
    }
}
export type ManualDataVendorItemArray = ConstructorParameters<typeof ManualDataVendorItem>
