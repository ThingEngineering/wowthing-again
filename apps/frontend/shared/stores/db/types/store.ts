import type { DbDataThing, DbDataThingArray } from './thing'


export interface DbData {
    mapsById: Record<number, string>
    requirementsById: Record<number, string>
    tagsById: Record<number, string>

    rawThings: DbDataThingArray[]
    things: DbDataThing[]

    tagsByString: Record<string, number>
    thingsByContentTypeAndId: Record<number, Record<number, DbDataThing[]>>
    thingsByMapId: Record<number, DbDataThing[]>
    thingsByRequirementId: Record<number, DbDataThing[]>
    thingsByTagId: Record<number, DbDataThing[]>
}
