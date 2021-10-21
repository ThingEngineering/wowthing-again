export interface ZoneMapData {
    sets: ZoneMapDataCategory[][]
}

export interface ZoneMapDataCategory {
    minimumLevel: number
    requiredQuestId: number
    mapName: string
    name: string
    slug: string
    wowheadGuide: string
    farms: ZoneMapDataFarm[]
}

export interface ZoneMapDataFarm {
    faction?: string
    npcId: number
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
    limit: string[]
    name: string
    type: string
}
