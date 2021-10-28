import type { FarmStatus, UserDataSetCount } from '@/types'

export interface ZoneMapData {
    counts?: Record<string, UserDataSetCount>
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
}

export interface ZoneMapDataDrop {
    id: number
    requiredQuestId?: number
    name: string
    note?: string
    type: string
    limit: string[]
}
