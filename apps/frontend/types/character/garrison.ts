export interface CharacterGarrison {
    level: number
    type: number
    buildings: CharacterGarrisonBuilding[]
}

export interface CharacterGarrisonBuilding {
    buildingId: number
    name: string
    plotId: number
    rank: number
}
