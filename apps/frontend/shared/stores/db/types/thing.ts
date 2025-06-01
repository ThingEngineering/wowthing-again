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
import { staticStore } from '@/shared/stores/static';
import { getItemTypeAndSubtype } from '@/utils/items/get-item-type-and-subtype';

import { DbResetType, DbThingContentType, DbThingType } from '../enums';
import { DbDataThingLocation } from './thing-location';
import { DbDataThingContent, type DbDataThingContentArray } from './thing-content';
import { DbDataThingGroup, type DbDataThingGroupArray } from './thing-group';
import { wowthingData } from '../../data/store.svelte';
import { itemStore } from '@/stores';

export class DbDataThing {
    public accountWide: boolean;
    public contents: DbDataThingContent[] = [];
    public faction: Faction = Faction.Both;
    public groups: DbDataThingGroup[] = [];
    public locations: Record<number, DbDataThingLocation[]> = {};

    constructor(
        public type: DbThingType,
        public id: number,
        public resetType: DbResetType,
        public highlightQuestId: number,
        public trackingQuestId: number,
        public worldQuestId: number,
        public zoneMapsGroupId: number,
        accountWide: number,
        public name: string,
        public note: string,
        public requirementIds: number[],
        public tagIds: number[],
        locationArrays: [number, number][],
        contentsArrays: DbDataThingContentArray[],
        groupsArrays?: DbDataThingGroupArray[],
    ) {
        this.accountWide = accountWide === 1;

        let thingFaction = 0;
        for (const [mapId, packedLocation] of locationArrays) {
            const location = new DbDataThingLocation(packedLocation);
            (this.locations[mapId] ||= []).push(location);

            if (location.faction === Faction.Alliance) {
                thingFaction |= 1;
            } else if (location.faction === Faction.Horde) {
                thingFaction |= 2;
            } else {
                thingFaction |= 3;
            }
        }

        if (thingFaction === 1) {
            this.faction = Faction.Alliance;
        } else if (thingFaction === 2) {
            this.faction = Faction.Horde;
        }

        for (const contentsArray of contentsArrays) {
            this.contents.push(new DbDataThingContent(...contentsArray));
        }

        for (const groupsArray of groupsArrays || []) {
            this.groups.push(new DbDataThingGroup(...groupsArray));
        }
    }

    private _vendor: ManualDataSharedVendor;
    public asVendor(): ManualDataSharedVendor {
        if (!this._vendor) {
            this._vendor = <ManualDataSharedVendor>{
                id: this.id,
                faction: this.faction,
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

        return this._vendor;
    }

    private _zoneMapsFarm: Record<string, ManualDataZoneMapFarm> = {};
    public asZoneMapsFarm(mapName: string): ManualDataZoneMapFarm {
        if (!this._zoneMapsFarm[mapName]) {
            const mapId = wowthingData.db.mapsByName.get(mapName);
            if (!mapId) {
                return;
            }

            const itemData = get(itemStore);
            const staticData = get(staticStore);

            let minimumLevel = 0;
            const requiredQuestIds: number[] = [];
            const requirementIds = this.requirementIds || [];
            for (const requirementId of requirementIds) {
                const requirementParts = wowthingData.db.requirementsById
                    .get(requirementId)
                    .split(' ');
                if (requirementParts[0] === 'level') {
                    minimumLevel = parseInt(requirementParts[1]);
                } else if (requirementParts[0] === 'quest') {
                    requiredQuestIds.push(...requirementParts.slice(1).map((s) => parseInt(s)));
                }
            }

            const personalLoot = this.tagIds.some(
                (tagId) => wowthingData.db.tagsById.get(tagId) === 'personal-loot',
            );

            const drops: ManualDataZoneMapDrop[] = [];
            for (const content of this.contents) {
                let classMask = 0;
                if (personalLoot) {
                    classMask = itemData.items[content.id]?.classMask || 0;
                }

                const [type, subType] = getItemTypeAndSubtype(
                    content.id,
                    thingContentTypeToRewardType[content.type],
                );

                const drop: ManualDataZoneMapDrop = {
                    id: content.id,
                    note: content.note,
                    classMask,
                    subType,
                    type,
                    limit: [],
                };

                if (type === RewardType.Item) {
                    // if this is an item that teaches a skill, add a profession skill limit
                    const requiredSkillLine = staticData.itemToSkillLine[drop.id];
                    if (requiredSkillLine) {
                        const profession =
                            staticData.professionBySkillLine[requiredSkillLine[0]]?.[0];
                        if (profession) {
                            drop.limit = [
                                'profession',
                                profession.slug,
                                requiredSkillLine[0].toString(),
                                requiredSkillLine[1].toString(),
                            ];
                        }
                    }
                }

                if (drop.limit.length === 0) {
                    const dropRequirementIds = requirementIds.concat(content.requirementIds || []);
                    if (dropRequirementIds.length > 0) {
                        for (const requirementId of dropRequirementIds) {
                            drop.limit = wowthingData.db.requirementsById
                                .get(requirementId)
                                .split(' ');
                        }
                    }
                }

                // if (!drop.note && drop.limit?.[0] === 'reputation') {
                //     drop.note = `{reputation:${drop.limit[1]}`;
                // }

                drops.push(drop);
            }

            const reset = dbResetTypeToFarmResetType[this.resetType];
            let type = thingTypeToFarmType[this.type];
            if (reset === FarmResetType.Weekly && type === FarmType.Kill) {
                type = FarmType.KillBig;
            }

            this._zoneMapsFarm[mapName] = <ManualDataZoneMapFarm>{
                faction:
                    this.faction === Faction.Both
                        ? null
                        : Faction[this.faction].toLocaleLowerCase(),
                groupId: this.zoneMapsGroupId,
                highlightQuestId: this.highlightQuestId,
                id: this.id,
                idType: thingTypeToFarmIdType[this.type],
                location: this.locations[mapId].flatMap((loc) => [
                    (parseFloat(loc.xCoordinate) % 100).toFixed(2),
                    (parseFloat(loc.yCoordinate) % 100).toFixed(2),
                ]),
                minimumLevel,
                name: this.name,
                note: this.note,
                questIds: [this.type === DbThingType.Quest ? this.id : this.trackingQuestId],
                requiredQuestIds,
                reset,
                type,
                worldQuestId: this.worldQuestId,
                drops,
            };
        }

        return this._zoneMapsFarm[mapName];
    }
}
export type DbDataThingArray = ConstructorParameters<typeof DbDataThing>;

const thingTypeToFarmType: Record<number, FarmType> = {
    [DbThingType.Event]: FarmType.Event,
    [DbThingType.Npc]: FarmType.Kill,
    [DbThingType.Object]: FarmType.Treasure,
    [DbThingType.Quest]: FarmType.Quest,
    [DbThingType.Vendor]: FarmType.Vendor,
};
const thingTypeToFarmIdType: Record<number, FarmIdType> = {
    [DbThingType.Event]: FarmIdType.Quest,
    [DbThingType.Npc]: FarmIdType.Npc,
    [DbThingType.Object]: FarmIdType.Object,
    [DbThingType.Quest]: FarmIdType.Quest,
    [DbThingType.Vendor]: FarmIdType.Npc,
};

const dbResetTypeToFarmResetType: Record<number, FarmResetType> = {
    [DbResetType.None]: FarmResetType.None,
    [DbResetType.Never]: FarmResetType.Never,
    [DbResetType.Daily]: FarmResetType.Daily,
    [DbResetType.Weekly]: FarmResetType.Weekly,
};

const thingContentTypeToRewardType: Record<number, RewardType> = {
    [DbThingContentType.Item]: RewardType.Item,
};
