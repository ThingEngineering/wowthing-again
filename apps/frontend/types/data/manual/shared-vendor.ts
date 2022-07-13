import { FarmIdType, FarmResetType, FarmType, RewardType } from '@/types/enums'
import type { StaticData } from '@/types/data/static'
import type { ManualDataZoneMapDrop, ManualDataZoneMapFarm } from './zone-map'
import { ManualDataVendorItem, type ManualDataVendorItemArray } from './vendor'


export class ManualDataSharedVendor {
    public sells: ManualDataVendorItem[]

    constructor(
        public id: number,
        public name: string,
        public tags: string[],
        public locations: Record<string, string[]>,
        sells: ManualDataVendorItemArray[],
        public note?: string
    )
    {
        this.sells = sells.map((arr) => new ManualDataVendorItem(...arr))
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
