import { DbDataThingLocation } from './thing-location';
import { DbDataThingContent, type DbDataThingContentArray } from './thing-content';
import { DbResetType, DbThingContentType, DbThingType } from '../enums';
import type { ManualDataZoneMapDrop, ManualDataZoneMapFarm } from '@/types/data/manual';
import { FarmIdType } from '@/enums/farm-id-type';
import { FarmResetType } from '@/enums/farm-reset-type';
import { FarmType } from '@/enums/farm-type';
import { RewardType } from '@/enums/reward-type';
import { get } from 'svelte/store';
import { dbStore } from '../store';

export class DbDataThing {
    public contents: DbDataThingContent[] = [];
    public locations: Record<number, DbDataThingLocation[]> = {};

    constructor(
        public type: DbThingType,
        public id: number,
        public resetType: DbResetType,
        public trackingQuestId: number,
        public zoneMapsGroupId: number,
        public name: string,
        public note: string,
        public requirementIds: number[],
        public tagIds: number[],
        locationArrays: [number, number][],
        contentsArrays: DbDataThingContentArray[] = [],
    ) {
        for (const [mapId, packedLocation] of locationArrays) {
            this.locations[mapId] ||= [];
            this.locations[mapId].push(new DbDataThingLocation(packedLocation));
        }

        for (const contentsArray of contentsArrays) {
            this.contents.push(new DbDataThingContent(...contentsArray));
        }
    }

    public asZoneMapsFarm(mapName: string): ManualDataZoneMapFarm {
        const dbData = get(dbStore);
        const mapId = dbData.mapsByName[mapName];
        if (!mapId) {
            return;
        }

        const drops: ManualDataZoneMapDrop[] = [];
        for (const content of this.contents) {
            const drop: ManualDataZoneMapDrop = {
                id: content.id,
                note: content.note,
                type: thingContentTypeToRewardType[content.type],
                classMask: 0,
                subType: 0,
            };

            if (this.requirementIds?.length > 0) {
                drop.limit = dbData.requirementsById[this.requirementIds[0]].split(' ');
            }

            drops.push(drop);
        }

        return <ManualDataZoneMapFarm>{
            groupId: this.zoneMapsGroupId,
            id: this.id,
            idType: thingTypeToFarmIdType[this.type],
            location: this.locations[mapId].flatMap((loc) => [loc.xCoordinate, loc.yCoordinate]),
            name: this.name,
            note: this.note,
            questIds: [this.trackingQuestId],
            reset: dbResetTypeToFarmResetType[this.resetType],
            type: thingTypeToFarmType[this.type],
            drops,
        };
    }
}
export type DbDataThingArray = ConstructorParameters<typeof DbDataThing>;

const thingTypeToFarmType: Record<number, FarmType> = {
    [DbThingType.Object]: FarmType.Treasure,
    [DbThingType.Vendor]: FarmType.Vendor,
};
const thingTypeToFarmIdType: Record<number, FarmIdType> = {
    [DbThingType.Object]: FarmIdType.Object,
    [DbThingType.Vendor]: FarmIdType.Npc,
};

const dbResetTypeToFarmResetType: Record<number, FarmResetType> = {
    [DbResetType.Never]: FarmResetType.Never,
};

const thingContentTypeToRewardType: Record<number, RewardType> = {
    [DbThingContentType.Item]: RewardType.Item,
};
