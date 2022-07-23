import { ManualDataVendorItem, type ManualDataVendorItemArray } from './vendor'
import { Faction, FarmIdType, FarmResetType, FarmType, RewardType } from '@/types/enums'
import type { ManualDataZoneMapDrop, ManualDataZoneMapFarm } from './zone-map'
import type { ManualData } from './store'
import type { StaticData } from '@/types/data/static'


export class ManualDataSharedVendor {
    public faction: Faction
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
        
        let faction = 0
        for (const locations of Object.values(this.locations)) {
            for (const location of locations) {
                if (location[2] === 'alliance') {
                    faction |= 1
                }
                else if (location[2] === 'horde') {
                    faction |= 2
                }
            }
        }
        
        if (faction === 0 || faction === 3) {
            this.faction = Faction.Both
        }
        else if (faction === 1) {
            this.faction = Faction.Alliance
        }
        else if (faction === 2) {
            this.faction = Faction.Horde
        }
    }

    asFarms(manualData: ManualData, staticData: StaticData, mapName: string): ManualDataZoneMapFarm[] {
        const ret: ManualDataZoneMapFarm[] = []
        
        const drops: ManualDataZoneMapDrop[] = []
        const seen: Record<number, boolean> = {}

        if (this.sets) {
            for (const set of this.sets) {
                const appearanceIds = this.sells
                    .slice(set.range[0], set.range[0] + set.range[1])
                    .map((item) => item.appearanceId ?? manualData.shared.items[item.id]?.appearanceId ?? 0)
                const costs: Record<number, number>[] = []
                
                for (let sellIndex = 0; sellIndex < this.sells.length; sellIndex++) {
                    costs.push(this.sells[sellIndex].costs)
                    seen[appearanceIds[sellIndex]] = true
                }
                
                drops.push({
                    id: 0,
                    type: RewardType.SetSpecial,
                    subType: 0,
                    classMask: 0,
                    appearanceIds: appearanceIds,
                    costs: costs,
                    limit: [set.name],
                })
            }

            for (const item of this.sells) {
                if (!seen[item.appearanceId ?? manualData.shared.items[item.id]?.appearanceId ?? 0]) {
                    drops.push({
                        id: item.id,
                        type: item.type,
                        subType: item.subType,
                        classMask: item.classMask,
                        note: item.getNote(manualData, staticData),
                    })
                }
            }
        }

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
                drops: drops,
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
        public sortKey?: string,
        public skipTooltip?: boolean
    )
    { }
}
export type ManualDataSharedVendorSetArray = ConstructorParameters<typeof ManualDataSharedVendorSet>
