export interface ManualDataDragonridingCategory {
    name: string
    groups: ManualDataDragonridingGroup[]
}

export interface ManualDataDragonridingGroup {
    name: string
    things: ManualDataDragonridingThing[]
}

export interface ManualDataDragonridingThing {
    itemId: number
    questId: number
}
