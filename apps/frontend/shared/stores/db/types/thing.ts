import { get } from 'svelte/store';

import type {
    ManualDataSharedVendor,
    ManualDataSharedVendorSet,
    ManualDataVendorItem,
    ManualDataZoneMapDrop,
    ManualDataZoneMapFarm,
} from '@/types/data/manual';
import { Faction } from '@/enums/faction';
import { FarmIdType } from '@/enums/farm-id-type';
import { FarmResetType } from '@/enums/farm-reset-type';
import { FarmType } from '@/enums/farm-type';
import { RewardType } from '@/enums/reward-type';
import { getItemTypeAndSubtype } from '@/utils/items/get-item-type-and-subtype';

import { DbResetType, DbThingContentType, DbThingType } from '../enums';
import { dbStore } from '../store';
import { DbDataThingLocation } from './thing-location';
import { DbDataThingContent, type DbDataThingContentArray } from './thing-content';
import { DbDataThingGroup, type DbDataThingGroupArray } from './thing-group';

export class DbDataThing {
    public contents: DbDataThingContent[] = [];
    public groups: DbDataThingGroup[] = [];
    public locations: Record<number, DbDataThingLocation[]> = {};

    constructor(
        public type: DbThingType,
        public id: number,
        public resetType: DbResetType,
        public trackingQuestId: number,
        public zoneMapsGroupId: number,
        public accountWide: boolean,
        public name: string,
        public note: string,
        public requirementIds: number[],
        public tagIds: number[],
        locationArrays: [number, number][],
        contentsArrays: DbDataThingContentArray[],
        groupsArrays?: DbDataThingGroupArray[],
    ) {
        for (const [mapId, packedLocation] of locationArrays) {
            this.locations[mapId] ||= [];
            this.locations[mapId].push(new DbDataThingLocation(packedLocation));
        }

        for (const contentsArray of contentsArrays) {
            this.contents.push(new DbDataThingContent(...contentsArray));
        }

        for (const groupsArray of groupsArrays || []) {
            this.groups.push(new DbDataThingGroup(...groupsArray));
        }
    }

    public asVendor(): ManualDataSharedVendor {
        return <ManualDataSharedVendor>{
            id: this.id,
            faction: Faction.Both,
            name: this.name,
            note: this.note,
            sets: this.groups.map((group) => <ManualDataSharedVendorSet>group),
            sells: this.contents.map(
                (content) =>
                    <ManualDataVendorItem>{
                        type: thingContentTypeToRewardType[content.type],
                        id: content.id,
                        costs: content.costs,
                        faction: Faction.Both,
                        trackingQuestId: content.trackingQuestId,
                    },
            ),
        };
    }

    public asZoneMapsFarm(mapName: string): ManualDataZoneMapFarm {
        const dbData = get(dbStore);
        const mapId = dbData.mapsByName[mapName];
        if (!mapId) {
            return;
        }

        let minimumLevel = 0;
        for (const requirementId of this.requirementIds) {
            const requirementParts = dbData.requirementsById[requirementId].split(' ');
            if (requirementParts[0] === 'level') {
                minimumLevel = parseInt(requirementParts[1]);
            }
        }

        const drops: ManualDataZoneMapDrop[] = [];
        for (const content of this.contents) {
            const [type, subType] = getItemTypeAndSubtype(content.id);

            const drop: ManualDataZoneMapDrop = {
                id: content.id,
                note: content.note,
                classMask: 0,
                subType,
                type,
            };

            for (const requirementId of content.requirementIds || []) {
                drop.limit = dbData.requirementsById[requirementId].split(' ');
            }

            drops.push(drop);
        }

        const reset = dbResetTypeToFarmResetType[this.resetType];
        let type = thingTypeToFarmType[this.type];
        if (reset === FarmResetType.Weekly && type === FarmType.Kill) {
            type = FarmType.KillBig;
        }

        return <ManualDataZoneMapFarm>{
            groupId: this.zoneMapsGroupId,
            id: this.id,
            idType: thingTypeToFarmIdType[this.type],
            location: this.locations[mapId].flatMap((loc) => [loc.xCoordinate, loc.yCoordinate]),
            minimumLevel,
            name: this.name,
            note: this.note,
            questIds: [this.trackingQuestId],
            reset,
            type,
            drops,
        };
    }
}
export type DbDataThingArray = ConstructorParameters<typeof DbDataThing>;

const thingTypeToFarmType: Record<number, FarmType> = {
    [DbThingType.Npc]: FarmType.Kill,
    [DbThingType.Object]: FarmType.Treasure,
    [DbThingType.Vendor]: FarmType.Vendor,
};
const thingTypeToFarmIdType: Record<number, FarmIdType> = {
    [DbThingType.Npc]: FarmIdType.Npc,
    [DbThingType.Object]: FarmIdType.Object,
    [DbThingType.Vendor]: FarmIdType.Npc,
};

const dbResetTypeToFarmResetType: Record<number, FarmResetType> = {
    [DbResetType.Never]: FarmResetType.Never,
    [DbResetType.Daily]: FarmResetType.Daily,
    [DbResetType.Weekly]: FarmResetType.Weekly,
};

const thingContentTypeToRewardType: Record<number, RewardType> = {
    [DbThingContentType.Item]: RewardType.Item,
};
