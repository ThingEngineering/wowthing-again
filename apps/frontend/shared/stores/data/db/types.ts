import intersectionWith from 'lodash/intersectionWith';

import type { DbDataQuery, DbDataThing, DbDataThingArray } from '../../db/types';

export interface RawDb {
    mapsById: Record<number, string>;
    rawThings: DbDataThingArray[];
    requirementsById: Record<number, string>;
    tagsById: Record<number, string>;
}

export class DataDb {
    // things: DbDataThing[] = [];
    thingsByMapId: Map<number, DbDataThing[]> = new Map();
    thingsByRequirementId: Map<number, DbDataThing[]> = new Map();
    thingsByTagId: Map<number, DbDataThing[]> = new Map();

    mapsById: Map<number, string> = new Map();
    mapsByName: Map<string, number> = new Map();

    requirementsById: Map<number, string> = new Map();

    tagsById: Map<number, string> = new Map();
    tagsByName: Map<string, number> = new Map();

    search(query: DbDataQuery): DbDataThing[] {
        const subsets: DbDataThing[][] = [];

        for (const mapName of query.maps || []) {
            const mapId = this.mapsByName.get(mapName);
            if (!mapId) {
                // console.warn('Invalid db map:', mapName);
                continue;
            }

            subsets.push(this.thingsByMapId.get(mapId));
        }

        for (const tagName of query.tags || []) {
            const tagId = this.tagsByName.get(tagName);
            if (!tagId) {
                // console.warn('Invalid db tag:', tagName);
                continue;
            }

            subsets.push(this.thingsByTagId.get(tagId));
        }

        let things = intersectionWith(...subsets, (a, b) => a === b);

        if (query.type) {
            things = things.filter((thing) => thing.type === query.type);
        }

        return things;
    }
}
