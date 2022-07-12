import { FarmIdType, FarmResetType, FarmType, RewardType } from '@/types/enums'
import type { StaticData } from '@/types/data/static'
import type { ManualDataZoneMapDrop, ManualDataZoneMapFarm } from './zone-map'


export class ManualDataSharedVendor {
    public sells: ManualDataSharedVendorItem[]

    constructor(
        public id: number,
        public name: string,
        public tags: string[],
        public locations: Record<string, string[]>,
        sells: ManualDataSharedVendorItemArray[],
        public note?: string
    )
    {
        this.sells = sells.map((arr) => new ManualDataSharedVendorItem(...arr))
    }

    asFarms(staticData: StaticData, mapName: string): ManualDataZoneMapFarm[] {
        const ret: ManualDataZoneMapFarm[] = []
        
        for (const location of (this.locations[mapName] || [])) {
            ret.push(<ManualDataZoneMapFarm>{
                faction: location[2],
                id: this.id,
                idType: FarmIdType.Npc,
                location: [location[0], location[1]],
                name: this.name,
                questIds: [],
                reset: FarmResetType.None,
                type: FarmType.Vendor,
                drops: this.sells.map((item) => <ManualDataZoneMapDrop>{
                    id: item.id,
                    type: item.type,
                    subType: 0,
                    classMask: 0,
                    note: item.getNote(staticData),
                }),
            })
        }

        return ret
    }
}
export type ManualDataSharedVendorArray = ConstructorParameters<typeof ManualDataSharedVendor>

export class ManualDataSharedVendorItem {
    public costs: Record<number, number>

    constructor(
        public type: RewardType,
        public id: number,
        costArrays?: number[][],
        public reputation?: number[],
        public note?: string,
    )
    {
        this.costs = {}
        if (costArrays) {
            for (const costArray of costArrays) {
                this.costs[costArray[0]] = costArray[1]
            }
        }
    }

    getNote(staticData: StaticData): string | undefined {
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
                
                if (this.reputation) {
                    parts.push(`{repPrice:${this.reputation[0]}|${this.reputation[1]}|${price}}`)
                }
                else {
                    parts.push(`{price:${price}}`)
                }
            }
            return parts.join(', ')
        }
        return undefined
    }
}
export type ManualDataSharedVendorItemArray = ConstructorParameters<typeof ManualDataSharedVendorItem>
