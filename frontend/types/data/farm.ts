export interface FarmData {
    sets: FarmDataCategory[][]
}

export interface FarmDataCategory {
    minimumLevel: number
    mapName: string
    name: string
    slug: string
    wowheadGuide: string
    farms: FarmDataFarm[]
}

export interface FarmDataFarm {
    faction?: string
    npcId: number
    name: string
    note: string
    reset: string
    type: string
    questIds: number[]
    location: string[]
    drops: FarmDataDrop[]
}

export interface FarmDataDrop {
    id: number
    limit: string[]
    name: string
    type: string
}
