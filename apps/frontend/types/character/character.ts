import { get } from 'svelte/store';

import { Constants } from '@/data/constants';
import { professionSpecializationToSpell } from '@/data/professions';
import { ItemLocation } from '@/enums/item-location';
import { itemStore } from '@/stores';
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
import type { Faction } from '@/enums/faction';
import type { StaticDataRealm } from '@/shared/stores/static/types';
import type { ItemDataItem } from '@/types/data/item';
import type { Guild } from '@/types/guild';

import type { CharacterConfiguration } from './configuration';
import { CharacterCurrency, type CharacterCurrencyArray } from './currency';
import type { CharacterEquippedItem } from './equipped-item';
import type { CharacterGarrison } from './garrison';
import { CharacterItem, type CharacterItemArray } from './item';
import type { CharacterLockout } from './lockout';
import {
    CharacterMythicPlusAddonMap,
    CharacterMythicPlusAddonRun,
    CharacterMythicPlusRun,
    type CharacterMythicPlus,
    type CharacterMythicPlusAddon,
    type CharacterMythicPlusAddonMapArray,
    type CharacterMythicPlusAddonRunArray,
} from './mythic-plus';
import type { CharacterProfession } from './profession';
import type { CharacterRaiderIoSeason } from './raider-io-season';
import type { CharacterReputation, CharacterReputationParagon } from './reputation';
import type { CharacterShadowlands } from './shadowlands';
import type { CharacterSpecializationRaw } from './specialization';
import {
    CharacterStatistics,
    CharacterStatisticBasic,
    CharacterStatisticMisc,
    CharacterStatisticRating,
    type CharacterStatisticBasicArray,
    type CharacterStatisticMiscArray,
    type CharacterStatisticRatingArray,
} from './statistics';
import { CharacterWeekly, type CharacterWeeklyArray } from './weekly';

import type { ContainsItems, HasNameAndRealm } from '../shared';
import type { Account } from '../account';
import type { CharacterAura } from './aura';
import { slotOrder } from '@/data/inventory-slot';
import { typeOrder } from '@/data/inventory-type';
import { InventoryType, weaponInventoryTypes } from '@/enums/inventory-type';
import { InventorySlot } from '@/enums/inventory-slot';

export class Character implements ContainsItems, HasNameAndRealm {
    // Calculated
    public account: Account;
    public guild: Guild;
    public realm: StaticDataRealm;

    public className: string;
    public raceName: string;
    public specializationName: string;

    public calculatedItemLevel: string;
    public calculatedItemLevelQuality: number;

    public bags: Record<number, number> = {};
    public currencies: Record<number, CharacterCurrency> = {};
    public itemsByAppearanceId: Record<number, CharacterItem[]>;
    public itemsByAppearanceSource: Record<string, CharacterItem[]>;
    public itemsById: Record<number, CharacterItem[]>;
    public itemsByLocation: Record<number, CharacterItem[]>;
    public mythicPlusSeasonScores: Record<number, number>;
    public mythicPlusSeasons: Record<number, Record<number, CharacterMythicPlusAddonMap>>;
    public mythicPlusWeeks: Record<number, CharacterMythicPlusAddonRun[]> = {};
    public professionSpecializations: Record<number, number>;
    public reputationData: Record<string, CharacterReputation>;
    public specializations: Record<number, Record<number, number>> = {};
    public statistics: CharacterStatistics = new CharacterStatistics();
    public weekly: CharacterWeekly;

    constructor(
        public id: number,
        public name: string,
        public isResting: number,
        public isWarMode: number,
        public accountId: number,
        public activeSpecId: number,
        public addonLevel: number,
        public addonLevelXp: number,
        public chromieTime: number,
        public classId: number,
        public equippedItemLevel: number,
        public faction: Faction,
        public gender: number,
        public guildId: number,
        public level: number,
        public playedTotal: number,
        public raceId: number,
        public realmId: number,
        public restedExperience: number,
        public gold: number,
        public currentLocation: string,
        public hearthLocation: string,
        public lastSeenAddon: number,

        public configuration: CharacterConfiguration,

        public auras: Record<number, CharacterAura>,
        public equippedItems: Record<number, CharacterEquippedItem>,
        public garrisons: Record<number, CharacterGarrison>,
        public garrisonTrees: Record<number, Record<number, number[]>>,
        public lockouts: Record<string, CharacterLockout>,
        public mythicPlus: CharacterMythicPlus,
        public mythicPlusAddon: Record<number, CharacterMythicPlusAddon>,
        rawMythicPlusSeasons: Record<number, Record<number, CharacterMythicPlusAddonMapArray>>,
        public paragons: Record<number, CharacterReputationParagon>,
        public professions: Record<number, Record<number, CharacterProfession>>,
        public professionCooldowns: Record<string, [number, number, number]>,
        professionSpecializations: Record<number, string>,
        public professionTraits: Record<number, Record<number, number>>,
        public raiderIo: Record<number, CharacterRaiderIoSeason>,
        public reputations: Record<number, number>,
        public shadowlands: CharacterShadowlands,
        rawWeekly: CharacterWeeklyArray,

        rawCurrencies: CharacterCurrencyArray[],
        rawItems: CharacterItemArray[],
        rawMythicPlusWeeks: Record<number, CharacterMythicPlusAddonRunArray[]>,
        rawSpecializations: Record<number, CharacterSpecializationRaw>,
        rawStatistics: [
            CharacterStatisticBasicArray[],
            CharacterStatisticMiscArray[],
            CharacterStatisticRatingArray[],
        ],
    ) {
        this.professionSpecializations = {};
        for (const [professionId, specialization] of Object.entries(professionSpecializations)) {
            const spellId = professionSpecializationToSpell[specialization];
            if (spellId) {
                this.professionSpecializations[parseInt(professionId)] = spellId;
            } else {
                console.log(`Unknown profession specialization: ${professionId} ${specialization}`);
            }
        }

        this._itemCounts = {};
        this.itemsByAppearanceId = {};
        this.itemsByAppearanceSource = {};
        this.itemsById = {};
        this.itemsByLocation = {};

        if (rawWeekly) {
            this.weekly = new CharacterWeekly(...rawWeekly);
        }

        for (const rawCurrency of rawCurrencies || []) {
            const obj = new CharacterCurrency(...rawCurrency);
            this.currencies[obj.id] = obj;
        }

        for (const rawItem of rawItems || []) {
            const obj = new CharacterItem(...rawItem);
            if (obj.slot === 0) {
                this.bags[obj.bagId] = obj.itemId;
            } else {
                (this.itemsByLocation[obj.location] ||= []).push(obj);
            }
        }

        if (this.mythicPlus) {
            this.mythicPlus.seasons = {};
            for (const [seasonId, seasonData] of getNumberKeyedEntries(
                this.mythicPlus.rawSeasons || {},
            )) {
                this.mythicPlus.seasons[seasonId] = {};
                for (const [mapId, runArrays] of getNumberKeyedEntries(seasonData)) {
                    this.mythicPlus.seasons[seasonId][mapId] = runArrays.map(
                        (runArray) => new CharacterMythicPlusRun(...runArray),
                    );
                }
            }
            this.mythicPlus.rawSeasons = null;
        }

        if (this.mythicPlusAddon) {
            for (const seasonData of Object.values(this.mythicPlusAddon)) {
                seasonData.runs = (seasonData.rawRuns || []).map(
                    (runArray) => new CharacterMythicPlusAddonRun(...runArray),
                );
                seasonData.rawRuns = null;
            }
        }

        this.mythicPlusSeasons = {};
        for (const [seasonId, seasonData] of getNumberKeyedEntries(rawMythicPlusSeasons || {})) {
            this.mythicPlusSeasons[seasonId] = {};
            for (const [mapId, mapArray] of getNumberKeyedEntries(seasonData)) {
                this.mythicPlusSeasons[seasonId][mapId] = new CharacterMythicPlusAddonMap(
                    ...mapArray,
                );
            }
        }

        for (const [week, runsArray] of Object.entries(rawMythicPlusWeeks || {})) {
            this.mythicPlusWeeks[parseInt(week)] = runsArray.map(
                (runArray) => new CharacterMythicPlusAddonRun(...runArray),
            );
        }

        for (const specializationId in rawSpecializations) {
            const specData: Record<number, number> = {};
            for (const [tierId, , spellId] of rawSpecializations[specializationId].talents) {
                specData[tierId] = spellId;
            }
            this.specializations[specializationId] = specData;
        }

        if (rawStatistics?.length === 3) {
            for (const basicArray of rawStatistics[0]) {
                const obj = new CharacterStatisticBasic(...basicArray);
                this.statistics.basic[obj.type] = obj;
            }

            for (const miscArray of rawStatistics[1]) {
                const obj = new CharacterStatisticMisc(...miscArray);
                this.statistics.misc[obj.type] = obj;
            }

            for (const ratingArray of rawStatistics[2]) {
                const obj = new CharacterStatisticRating(...ratingArray);
                this.statistics.rating[obj.type] = obj;
            }
        }
    }

    get isMaxLevel(): boolean {
        return this.level === Constants.characterMaxLevel;
    }

    private _bestItemLevel: string;
    get bestItemLevel(): string {
        if (this._bestItemLevel) {
            return this._bestItemLevel;
        }

        const bestItemLevels: Record<number, [ItemDataItem, number][]> = {};
        const itemData = get(itemStore);

        for (const locationItem of this.itemsByLocation[ItemLocation.Bags] || []) {
            const item = itemData.items[locationItem.itemId];
            if (item?.inventoryType) {
                const sighInventoryType =
                    item.inventoryType === InventoryType.Chest2
                        ? InventoryType.Chest
                        : item.inventoryType;
                (bestItemLevels[sighInventoryType] ||= []).push([item, locationItem.itemLevel]);
            }
        }

        for (const slot of slotOrder) {
            const equippedItem = this.equippedItems[slot];
            if (equippedItem === undefined) {
                continue;
            }

            const item = itemData.items[equippedItem.itemId];
            const sighInventoryType =
                item.inventoryType === InventoryType.Chest2
                    ? InventoryType.Chest
                    : item.inventoryType;
            (bestItemLevels[sighInventoryType] ||= []).push([item, equippedItem.itemLevel]);
        }

        let count = 0;
        let levels = 0;
        for (const inventoryType of typeOrder) {
            if ([InventoryType.Chest2, InventoryType.Tabard].includes(inventoryType)) {
                continue;
            }

            const bestForType = bestItemLevels[inventoryType];
            if (!bestForType) {
                continue;
            }

            bestForType.sort((a, b) => b[1] - a[1]);
            if ([InventoryType.Finger, InventoryType.Trinket].includes(inventoryType)) {
                // TODO handle limit category
                count += 2;
                levels += bestForType[0][1];
                levels += bestForType[1]?.[1] || 0;
            } else if (!weaponInventoryTypes.has(inventoryType)) {
                // TODO handle weapons, oof
                count++;
                levels += bestForType[0][1];
            }
        }

        // use equipped weapons for now
        count += 2;
        levels += this.equippedItems[InventorySlot.MainHand]?.itemLevel || 0;
        if (this.equippedItems[InventorySlot.OffHand]) {
            levels += this.equippedItems[InventorySlot.OffHand].itemLevel;
        } else {
            levels += this.equippedItems[InventorySlot.MainHand]?.itemLevel || 0;
        }

        this._bestItemLevel = (levels / count).toFixed(1);
        return this._bestItemLevel;
    }

    private _itemCounts: Record<number, number>;
    getItemCount(itemId: number): number {
        return (this._itemCounts[itemId] ||= (this.itemsById[itemId] || []).reduce(
            (a, b) => a + b.count,
            0,
        ));
    }

    private _professionKnownAbilities: Set<number> = undefined;
    knowsProfessionAbility(abilityId: number): boolean {
        if (this._professionKnownAbilities === undefined) {
            this._professionKnownAbilities = new Set<number>();
            for (const profession of Object.values(this.professions || {})) {
                for (const subProfession of Object.values(profession)) {
                    for (const abilityId of subProfession.knownRecipes) {
                        this._professionKnownAbilities.add(abilityId);
                    }
                }
            }
        }
        return this._professionKnownAbilities.has(abilityId);
    }
}
export type CharacterArray = ConstructorParameters<typeof Character>;
