import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
import { DbDataThing } from '../../db/types';
import { DataDb, type RawDb } from './types';

export function processDbData(rawData: RawDb): DataDb {
    console.time('processDbData');

    const data = new DataDb();

    for (const [mapId, mapName] of getNumberKeyedEntries(rawData.mapsById)) {
        data.mapsById.set(mapId, mapName);
        data.mapsByName.set(mapName, mapId);
        data.thingsByMapId.set(mapId, []);
    }

    for (const [reqId, reqString] of getNumberKeyedEntries(rawData.requirementsById)) {
        data.requirementsById.set(reqId, reqString);
        data.thingsByRequirementId.set(reqId, []);
    }

    for (const [tagId, tagString] of getNumberKeyedEntries(rawData.tagsById)) {
        data.tagsById.set(tagId, tagString);
        data.tagsByName.set(tagString, tagId);
        data.thingsByTagId.set(tagId, []);
    }

    for (const thingArray of rawData.rawThings) {
        const thing = new DbDataThing(...thingArray);

        for (const mapId of Object.keys(thing.locations).map((s) => parseInt(s))) {
            data.thingsByMapId.get(mapId).push(thing);
        }

        for (const requirementId of thing.requirementIds) {
            data.thingsByRequirementId.get(requirementId).push(thing);
        }

        for (const tagId of thing.tagIds) {
            data.thingsByTagId.get(tagId).push(thing);
        }
    }

    console.timeEnd('processDbData');

    return data;
}
