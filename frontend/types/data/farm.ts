export interface FarmData {
    sets: FarmDataCategory[][]
}

export interface FarmDataCategory {
    minimumLevel: number
    name: string
    slug: string
    farms: FarmDataFarm[]
}

export interface FarmDataFarm {
    questId: number
    name: string
    reset: string
    location: string[]
    drops: FarmDataDrop[]
}

export interface FarmDataDrop {
    id: number
    limit: string[]
    name: string
    type: string
}
