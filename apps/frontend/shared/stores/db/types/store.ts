import type { DbDataThing, DbDataThingArray } from './thing';

export interface DbData {
    mapsById: Record<number, string>;
    requirementsById: Record<number, string>;
    tagsById: Record<number, string>;

    rawThings: DbDataThingArray[];
    things: DbDataThing[];

    thingsByContentTypeAndId: Record<number, Record<number, DbDataThing[]>>;
    thingsByMapId: Record<number, DbDataThing[]>;
    thingsByRequirementId: Record<number, DbDataThing[]>;
    thingsByTagId: Record<number, DbDataThing[]>;

    mapsByName: Record<string, number>;
    tagsByName: Record<string, number>;
}
