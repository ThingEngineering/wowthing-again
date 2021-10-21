export interface ZoneMapData {
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
    npcId: number
    faction?: string
    name: string
    note: string
    reset: string
    type: string
    questIds: number[]
    location: string[]
    drops: ZoneMapDataDrop[]
}

export interface ZoneMapDataDrop {
    id: number
    requiredQuestId?: number
    name: string
    type: string
    limit: string[]
}
