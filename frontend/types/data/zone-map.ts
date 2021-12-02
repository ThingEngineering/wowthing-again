import type { FarmStatus, UserCount } from '@/types'
import type { FarmDropType } from '@/types/enums'

export interface ZoneMapData {
    counts?: Record<string, UserCount>
    farmStatus?: Record<string, FarmStatus[]>
    sets: ZoneMapDataCategory[][]
}

export interface ZoneMapDataCategory {
    minimumLevel: number
    mapName: string
    name: string
    slug: string
    wowheadGuide: string
    requiredQuestIds: number[]
    farms: ZoneMapDataFarm[]
}

export interface ZoneMapDataFarm {
    minimumLevel?: number
    npcId?: number
    objectId?: number
    faction?: string
    name: string
    note: string
    reset: string
    type: string
    questIds: number[]
    requiredQuestIds: number[]
    location: string[]
    drops: ZoneMapDataDrop[]
    dropsRaw: ZoneMapDataDropArray[]
}

export class ZoneMapDataDrop {
    constructor(
        public id: number,
        public type: FarmDropType,
        public name: string,
        public limit?: string[],
        public questIds?: number[],
        public requiredQuestId?: number,
        public note?: string
    )
    {}
}

type ZoneMapDataDropArray = ConstructorParameters<typeof ZoneMapDataDrop>
