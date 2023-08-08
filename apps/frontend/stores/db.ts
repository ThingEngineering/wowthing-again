import { WritableFancyStore } from '@/types'
import type { DbData, DbDataQuery, DbDataThing } from '@/types/data/db'


export class DbDataStore extends WritableFancyStore<DbData> {
    get dataUrl(): string {
    return document
        .getElementById('app')
        ?.getAttribute('data-db')
    }

    initialize(data: DbData): void {
        console.time('DbDataStore.initialize')

        data.thingsByMapId = {}
        data.thingsByRequirementId = {}
        data.thingsByTagId = {}

        for (const thing of data.things) {
            for (const location of (thing.locations || [])) {
                data.thingsByMapId[location.mapId] ||= []
                data.thingsByMapId[location.mapId].push(thing)
            }

            for (const requirementId of (thing.requirementIds || [])) {
                data.thingsByRequirementId[requirementId] ||= []
                data.thingsByRequirementId[requirementId].push(thing)
            }

            for (const tagId of (thing.tagIds || [])) {
                data.thingsByTagId[tagId] ||= []
                data.thingsByTagId[tagId].push(thing)
            }
        }

        // console.log(data)

        console.timeEnd('DbDataStore.initialize')
    }

    search(query: DbDataQuery): DbDataThing[] {
        const subsets = []


        return []
    }
}

export const dbStore = new DbDataStore()
