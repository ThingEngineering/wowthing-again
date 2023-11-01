export interface DbData {
    mapsById: Record<number, string>
    requirementsById: Record<number, string>
    tagsById: Record<number, string>
    things: DbDataThing[]

    tagsByString: Record<string, number>
    thingsByMapId: Record<number, DbDataThing[]>
    thingsByRequirementId: Record<number, DbDataThing[]>
    thingsByTagId: Record<number, DbDataThing[]>
}

export interface DbDataThing {
    locations: DbDataThingLocation[]
    name: string
    requirementIds?: number[]
    tagIds?: number[]
    trackingQuestId?: number
}

export interface DbDataThingLocation {
    mapId: number
    packedLocation: number
}
