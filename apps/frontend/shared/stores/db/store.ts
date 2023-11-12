import { WritableFancyStore } from '@/types/fancy-store'
import { DbDataThing, type DbData } from './types'


class DbDataStore extends WritableFancyStore<DbData> {
    get dataUrl(): string {
    return document
        .getElementById('app')
        ?.getAttribute('data-db')
    }

    initialize(data: DbData): void {
        console.time('DbDataStore.initialize')

        data.things = []
        for (const thingArray of data.rawThings) {
            data.things.push(new DbDataThing(...thingArray))
        }
        data.rawThings = null

        data.tagsByString = Object.fromEntries(
            Object.entries(data.tagsById)
                .map(([id, tag]) => [tag, parseInt(id)])
        )

        data.thingsByContentTypeAndId = {}
        data.thingsByMapId = {}
        data.thingsByRequirementId = {}
        data.thingsByTagId = {}

        for (const thing of data.things) {
            for (const mapIdString in thing.locations) {
                const mapId = parseInt(mapIdString);
                (data.thingsByMapId[mapId] ||= [])
                    .push(thing)
            }

            for (const requirementId of thing.requirementIds) {
                (data.thingsByRequirementId[requirementId] ||= [])
                    .push(thing)
            }

            for (const tagId of thing.tagIds) {
                (data.thingsByTagId[tagId] ||= [])
                    .push(thing)
            }

            for (const content of thing.contents) {
                ((data.thingsByContentTypeAndId[content.type] ||= {})[content.id] ||= [])
                    .push(thing)

                for (const requirementId of content.requirementIds) {
                    (data.thingsByRequirementId[requirementId] ||= [])
                        .push(thing)
                }
    
                for (const tagId of content.tagIds) {
                    (data.thingsByTagId[tagId] ||= [])
                        .push(thing)
                }
            }
        }

        console.log(data)

        console.timeEnd('DbDataStore.initialize')
    }

    // search(query: DbDataQuery): DbDataThing[] {
    //     const subsets = []


    //     return []
    // }
}

export const dbStore = new DbDataStore()
