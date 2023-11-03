import { DbDataThingLocation } from './thing-location'
import { DbDataThingContent, type DbDataThingContentArray } from './thing-content'
import type { DbResetType, DbThingType } from '../enums'


export class DbDataThing {
    public contents: DbDataThingContent[] = []
    public locations: Record<number, DbDataThingLocation[]> = {}

    constructor(
        public type: DbThingType,
        public id: number,
        public resetype: DbResetType,
        public trackingQuestId: number,
        public name: string,
        public note: string,
        public requirementIds: number[],
        public tagIds: number[],
        locationArrays: [number, number][],
        contentsArrays: DbDataThingContentArray[]
    )
    {
        for (const [mapId, packedLocation] of locationArrays) {
            this.locations[mapId] ||= []
            this.locations[mapId].push(new DbDataThingLocation(packedLocation))
        }

        for (const contentsArray of contentsArrays) {
            this.contents.push(new DbDataThingContent(...contentsArray))
        }
    }
}
export type DbDataThingArray = ConstructorParameters<typeof DbDataThing>
