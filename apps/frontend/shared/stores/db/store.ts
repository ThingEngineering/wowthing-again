import intersectionWith from 'lodash/intersectionWith';

import { WritableFancyStore } from '@/types/fancy-store';
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
import { DbDataThing, type DbData, type DbDataQuery } from './types';

class DbDataStore extends WritableFancyStore<DbData> {
    get dataUrl(): string {
        return document.getElementById('app')?.getAttribute('data-db');
    }

    initialize(data: DbData): void {
        console.time('DbDataStore.initialize');

        data.things = [];
        for (const thingArray of data.rawThings) {
            data.things.push(new DbDataThing(...thingArray));
        }
        data.rawThings = null;

        data.mapsByName = Object.fromEntries(
            getNumberKeyedEntries(data.mapsById).map(([id, name]) => [name, id]),
        );

        data.tagsByName = Object.fromEntries(
            Object.entries(data.tagsById).map(([id, tag]) => [tag, parseInt(id)]),
        );

        data.thingsByContentTypeAndId = {};
        data.thingsByMapId = {};
        data.thingsByRequirementId = {};
        data.thingsByTagId = {};

        for (const thing of data.things) {
            for (const mapIdString in thing.locations) {
                const mapId = parseInt(mapIdString);
                (data.thingsByMapId[mapId] ||= []).push(thing);
            }

            for (const requirementId of thing.requirementIds) {
                (data.thingsByRequirementId[requirementId] ||= []).push(thing);
            }

            for (const tagId of thing.tagIds) {
                (data.thingsByTagId[tagId] ||= []).push(thing);
            }

            for (const content of thing.contents) {
                ((data.thingsByContentTypeAndId[content.type] ||= {})[content.id] ||= []).push(
                    thing,
                );

                for (const requirementId of content.requirementIds) {
                    (data.thingsByRequirementId[requirementId] ||= []).push(thing);
                }

                for (const tagId of content.tagIds) {
                    (data.thingsByTagId[tagId] ||= []).push(thing);
                }
            }
        }

        console.timeEnd('DbDataStore.initialize');
    }

    search(query: DbDataQuery): DbDataThing[] {
        const subsets: DbDataThing[][] = [];

        for (const mapName of query.maps || []) {
            const mapId = this.value.mapsByName[mapName];
            if (!mapId) {
                console.warn('Invalid db map:', mapName);
                continue;
            }

            subsets.push(this.value.thingsByMapId[mapId]);
        }

        for (const tagName of query.tags || []) {
            const tagId = this.value.tagsByName[tagName];
            if (!tagId) {
                console.warn('Invalid db tag:', tagName);
                continue;
            }

            console.log(tagName, tagId, this.value.thingsByTagId[tagId]);
            subsets.push(this.value.thingsByTagId[tagId]);
        }

        console.log('subsets', subsets);
        return intersectionWith(...subsets, (a, b) => a === b);
    }
}

export const dbStore = new DbDataStore();
