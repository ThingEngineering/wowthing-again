import every from 'lodash/every'

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
            let setPosition = 0;
            for (const set of this.sets) {
                const appearanceIds: number[][] = []
                const costs: Record<number, number>[] = []

                if (set.range[1] > 0) {
                    setPosition = set.range[1]
                }
                
                let setEnd = setPosition + set.range[0]
                if (set.range[0] === -1) {
                    setEnd = this.sells.length
                }

                for (let sellIndex = setPosition; sellIndex < setEnd; sellIndex++) {
                    setPosition++

                    const item = this.sells[sellIndex]
                    if (!item) {
                        console.error('Fell off the end at', sellIndex, set)
                        break
                    }

                    costs.push(item.costs)
                    
                    if (item.appearanceIds?.length > 0) {
                        appearanceIds.push(item.appearanceIds)
                    }
                    else {
                        appearanceIds.push([manualData.shared.items[item.id]?.appearanceIds?.[0] ?? 0])
                    }

                    for (const appearanceId of appearanceIds[appearanceIds.length - 1]) {
                        if (appearanceId > 0) {
                            seen[appearanceId] = true
                        }
                    }
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
                const itemSeen = item.appearanceIds?.length > 0
                    ? every(item.appearanceIds, (appearanceId) => seen[appearanceId])
                    : seen[manualData.shared.items[item.id]?.appearanceIds?.[0] ?? 0]

                if (!itemSeen) {
                    drops.push({
                        id: item.id,
                        type: item.type,
                        subType: item.subType,
                        classMask: item.classMask,
                        appearanceIds: [item.appearanceIds],
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
