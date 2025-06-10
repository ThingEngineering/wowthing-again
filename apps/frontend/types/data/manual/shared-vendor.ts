import { ManualDataVendorItem, type ManualDataVendorItemArray } from './vendor';
import { Faction } from '@/enums/faction';
import { FarmIdType } from '@/enums/farm-id-type';
import { FarmResetType } from '@/enums/farm-reset-type';
import { FarmType } from '@/enums/farm-type';
import { RewardType } from '@/enums/reward-type';
import { wowthingData } from '@/shared/stores/data';
import type { ManualDataZoneMapDrop, ManualDataZoneMapFarm } from './zone-map';

export class ManualDataSharedVendor {
    private drops: ManualDataZoneMapDrop[];

    public faction: Faction;
    public sells: ManualDataVendorItem[];
    public sets: ManualDataSharedVendorSet[];

    constructor(
        public id: number,
        public name: string,
        public tags: string[],
        public locations: Record<string, string[]>,
        sells: ManualDataVendorItemArray[],
        sets: ManualDataSharedVendorSetArray[],
        public note?: string,
        public zoneMapsGroupId?: number
    ) {
        this.sells = sells.map((itemArray) => new ManualDataVendorItem(...itemArray));
        this.sets = sets.map((setArray) => new ManualDataSharedVendorSet(...setArray));

        let faction = 0;
        for (const locations of Object.values(this.locations)) {
            for (const location of locations) {
                if (location[2] === 'alliance') {
                    faction |= 1;
                } else if (location[2] === 'horde') {
                    faction |= 2;
                }
            }
        }

        if (faction === 0 || faction === 3) {
            this.faction = Faction.Both;
        } else if (faction === 1) {
            this.faction = Faction.Alliance;
        } else if (faction === 2) {
            this.faction = Faction.Horde;
        }
    }

    createFarmData() {
        const seen: Record<number, boolean> = {};
        const itemDrops: ManualDataZoneMapDrop[] = [];
        const setDrops: ManualDataZoneMapDrop[] = [];

        const setItems: Record<number, boolean> = {};

        if (this.sets) {
            let setPosition = 0;
            for (const set of this.sets) {
                const appearanceIds: number[][] = [];
                const costs: Record<number, number>[] = [];
                const vendorItems: ManualDataVendorItem[] = [];

                if (set.range[1] > 0) {
                    setPosition = set.range[1];
                }

                let setEnd = setPosition + set.range[0];
                if (set.range[0] === -1) {
                    setEnd = this.sells.length;
                }

                for (let sellIndex = setPosition; sellIndex < setEnd; sellIndex++) {
                    setPosition++;

                    const item = this.sells[sellIndex];
                    if (!item) {
                        console.error('Fell off the end at', sellIndex, set);
                        break;
                    }

                    setItems[sellIndex] = true;

                    costs.push(item.costs);
                    vendorItems.push(item);

                    const itemAppearanceIds =
                        item.appearanceIds?.[0] > 0
                            ? item.appearanceIds
                            : [
                                  wowthingData.items.items[item.id]?.appearances?.[0]
                                      ?.appearanceId || 0,
                              ];
                    appearanceIds.push(itemAppearanceIds);

                    for (const appearanceId of itemAppearanceIds) {
                        if (appearanceId > 0) {
                            seen[appearanceId] = true;
                        }
                    }
                }

                setDrops.push({
                    id: 0,
                    type: RewardType.SetSpecial,
                    subType: 0,
                    classMask: 0,
                    appearanceIds: appearanceIds,
                    costs: costs,
                    limit: [set.name],
                    vendorItems,
                });
            }

            for (let sellIndex = 0; sellIndex < this.sells.length; sellIndex++) {
                if (setItems[sellIndex]) {
                    continue;
                }

                const item = this.sells[sellIndex];
                const appearanceIds =
                    item.appearanceIds?.[0] > 0
                        ? item.appearanceIds
                        : [wowthingData.items.items[item.id]?.appearances?.[0]?.appearanceId || 0];

                if (
                    appearanceIds.every((appearanceId) => appearanceId === 0 || !seen[appearanceId])
                ) {
                    itemDrops.push({
                        id: item.id,
                        type: item.type,
                        subType: item.subType,
                        classMask: item.classMask,
                        appearanceIds: [appearanceIds],
                        note: item.getNote(),
                    });
                }
            }
        }

        this.drops = [...itemDrops, ...setDrops];
    }

    public asFarms(mapName: string): ManualDataZoneMapFarm[] {
        const ret: ManualDataZoneMapFarm[] = [];

        for (const location of this.locations[mapName] || []) {
            ret.push(<ManualDataZoneMapFarm>{
                faction: location[2],
                groupId: this.zoneMapsGroupId,
                id: this.id > 1000000 ? this.id - 1000000 : this.id,
                idType: FarmIdType.Npc,
                location: [location[0], location[1]],
                name: this.name,
                note: this.note,
                questIds: [],
                reset: FarmResetType.None,
                type: FarmType.Vendor,
                drops: this.drops,
            });
        }

        return ret;
    }
}
export type ManualDataSharedVendorArray = ConstructorParameters<typeof ManualDataSharedVendor>;

export class ManualDataSharedVendorSet {
    constructor(
        public name: string,
        public range: number[],
        public sortKey?: string,
        public showNormalTag?: boolean,
        public skipTooltip?: boolean,
        public bonusIds?: number[]
    ) {}
}
export type ManualDataSharedVendorSetArray = ConstructorParameters<
    typeof ManualDataSharedVendorSet
>;
