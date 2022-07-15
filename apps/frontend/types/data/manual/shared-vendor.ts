import { ManualDataVendorItem, type ManualDataVendorItemArray } from './vendor'
import { FarmIdType, FarmResetType, FarmType } from '@/types/enums'
import type { ManualDataZoneMapDrop, ManualDataZoneMapFarm } from './zone-map'


export class ManualDataSharedVendor {
    public sells: ManualDataVendorItem[]
    public sets: ManualDataSharedVendorSet[]

    constructor(
        public id: number,
        public name: string,
        public tags: string[],
        public locations: Record<string, string[]>,
        sells: ManualDataVendorItemArray[],
        sets: ManualDataSharedVendorSetArray[],
        public note?: string
    )
    {
        this.sells = sells.map((itemArray) => new ManualDataVendorItem(...itemArray))
        this.sets = sets.map((setArray) => new ManualDataSharedVendorSet(...setArray))
    }

    asFarms(mapName: string): ManualDataZoneMapFarm[] {
        const ret: ManualDataZoneMapFarm[] = []
        
        for (const location of (this.locations[mapName] || [])) {
            ret.push(<ManualDataZoneMapFarm>{
                faction: location[2],
                id: this.id > 1000000 ? this.id - 1000000 : this.id,
                idType: FarmIdType.Npc,
                location: [location[0], location[1]],
                name: this.name,
                note: this.note,
                questIds: [],
                reset: FarmResetType.None,
                type: FarmType.Vendor,
                drops: this.sells.map((item) => <ManualDataZoneMapDrop>{
                    id: item.id,
                    type: item.type,
                    subType: item.subType,
                    classMask: item.classMask,
                    note: item.getNote(),
                }),
            })
        }

        return ret
    }
}
export type ManualDataSharedVendorArray = ConstructorParameters<typeof ManualDataSharedVendor>

export class ManualDataSharedVendorSet {
    constructor(
        public name: string,
        public range: number[],
        public sortKey?: string
    )
    { }
}
export type ManualDataSharedVendorSetArray = ConstructorParameters<typeof ManualDataSharedVendorSet>
