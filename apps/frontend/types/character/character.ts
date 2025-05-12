import { DateTime } from 'luxon';
import { get } from 'svelte/store';

import { Constants } from '@/data/constants';
import { professionSpecializationToSpell } from '@/data/professions';
import { Profession } from '@/enums/profession';
import { staticStore } from '@/shared/stores/static';
import { getBestItemLevels } from '@/utils/characters/get-best-item-levels';
import { leftPad } from '@/utils/formatting';
import { getCharacterLevel } from '@/utils/get-character-level';
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
import type { Faction } from '@/enums/faction';
import type { InventoryType } from '@/enums/inventory-type';
import type { Region } from '@/enums/region';
import type { StaticData, StaticDataRealm } from '@/shared/stores/static/types';
import type { Guild } from '@/types/guild';

import type { CharacterConfiguration } from './configuration';
import { CharacterCurrency, type CharacterCurrencyArray } from './currency';
import { CharacterEquippedItem, type CharacterEquippedItemArray } from './equipped-item';
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
import type { ItemData } from '../data/item';
import type { CharacterPatronOrder } from './patron-order';

export class Character implements ContainsItems, HasNameAndRealm {
    // Calculated
    public hidden: boolean;
    public ignored: boolean;

    public account: Account;
    public guild: Guild;
    public realm: StaticDataRealm;
    public region: Region;

    public className: string;
    public raceName: string;
    public specializationName: string;

    public calculatedItemLevel: string;
    public calculatedItemLevelQuality: number;
    public lastApiUpdate: DateTime;
    public lastSeenAddon: DateTime;
    public scannedCurrencies: DateTime;

    public bags: Record<number, number> = {};
    public currencies: Record<number, CharacterCurrency> = {};
    public equippedItems: Record<number, CharacterEquippedItem>;
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
        public level: number,
        public levelXp: number,
        public chromieTime: number,
        public classId: number,
        public equippedItemLevel: number,
        public faction: Faction,
        public gender: number,
        public guildId: number,
        public playedTotal: number,
        public raceId: number,
        public realmId: number,
        public restedExperience: number,
        public gold: number,
        public currentLocation: string,
        public hearthLocation: string,
        lastApiUpdateUnix: number,
        lastSeenAddonUnix: number,
        scannedCurrenciesUnix: number,

        public configuration: CharacterConfiguration,

        public auras: Record<number, CharacterAura>,
        rawEquippedItems: Record<number, CharacterEquippedItemArray>,
        public garrisons: Record<number, CharacterGarrison>,
        public garrisonTrees: Record<number, Record<number, number[]>>,
        public highestItemLevel: Record<number, number>,
        public knownSpells: number[],
        public lockouts: Record<string, CharacterLockout>,
        public mythicPlus: CharacterMythicPlus,
        public mythicPlusAddon: Record<number, CharacterMythicPlusAddon>,
        rawMythicPlusSeasons: Record<number, Record<number, CharacterMythicPlusAddonMapArray>>,
        public paragons: Record<number, CharacterReputationParagon>,
        public patronOrders: Record<number, CharacterPatronOrder[]>,
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
        const pandaCooking = this.professions?.[Profession.Cooking]?.[2544];
        if (pandaCooking) {
            for (let skillLineId = 975; skillLineId <= 980; skillLineId++) {
                const skillLine = this.professions[Profession.Cooking][skillLineId];
                if (skillLine) {
                    for (const abilityId of skillLine.knownRecipes || []) {
                        pandaCooking.knownRecipes.push(abilityId);
                    }
                }
            }
        }

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

        this.equippedItems = {};
        for (const [slot, rawEquippedItemArray] of getNumberKeyedEntries(rawEquippedItems || {})) {
            const obj = new CharacterEquippedItem(...rawEquippedItemArray);
            this.equippedItems[slot] = obj;
        }

        for (const rawItem of rawItems || []) {
            const obj = new CharacterItem(...rawItem);
            if (obj.slot === 0) {
                this.bags[obj.bagId] = obj.itemId;
            } else {
                (this.itemsById[obj.itemId] ||= []).push(obj);
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

        if (lastApiUpdateUnix && lastApiUpdateUnix > Constants.defaultUnixTime) {
            this.lastApiUpdate = DateTime.fromSeconds(lastApiUpdateUnix);
        }

        if (lastSeenAddonUnix && lastSeenAddonUnix > Constants.defaultUnixTime) {
            this.lastSeenAddon = DateTime.fromSeconds(lastSeenAddonUnix);
        }

        if (scannedCurrenciesUnix && scannedCurrenciesUnix > Constants.defaultUnixTime) {
            this.scannedCurrencies = DateTime.fromSeconds(scannedCurrenciesUnix);
        }
    }

    private _fancyLevel: string;
    get fancyLevel(): string {
        if (!this._fancyLevel) {
            const levelData = getCharacterLevel(this);
            if (levelData.level < Constants.characterMaxLevel) {
                this._fancyLevel = `${leftPad(levelData.level, 2, '&nbsp;')}.${levelData.partial}`;
            } else {
                this._fancyLevel = `${leftPad(levelData.level, 2, '&nbsp;')}&nbsp;&nbsp;`;
            }
        }
        return this._fancyLevel;
    }

    get isMaxLevel(): boolean {
        return this.level === Constants.characterMaxLevel;
    }

    public bestItemLevels: Record<number, [string, InventoryType[]]>;
    getBestItemLevels(
        itemData: ItemData,
        staticData: StaticData,
    ): Record<number, [string, InventoryType[]]> {
        this.bestItemLevels ||= getBestItemLevels(itemData, staticData, this);
        return this.bestItemLevels;
    }

    private _itemCounts: Record<number, number>;
    getItemCount(itemId: number): number {
        return (this._itemCounts[itemId] ||= (this.itemsById[itemId] || []).reduce(
            (a, b) => a + b.count,
            0,
        ));
    }

    private _professionKnownAbilities: Set<number> = undefined;
    get allProfessionAbilities(): Set<number> {
        if (this._professionKnownAbilities === undefined) {
            this._professionKnownAbilities = new Set<number>();
            const staticData = get(staticStore);

            for (const profession of Object.values(this.professions || {})) {
                for (const subProfession of Object.values(profession)) {
                    for (const knownAbilityId of subProfession.knownRecipes || []) {
                        this._professionKnownAbilities.add(knownAbilityId);

                        // known abilities often only has the highest rank, backfill lower ranks
                        const { ability } =
                            staticData.professionAbilityByAbilityId[knownAbilityId] || {};
                        if (ability?.extraRanks && ability.id !== knownAbilityId) {
                            this._professionKnownAbilities.add(ability.id);
                            for (const [rankAbilityId] of ability.extraRanks) {
                                if (rankAbilityId === knownAbilityId) {
                                    break;
                                }
                                this._professionKnownAbilities.add(rankAbilityId);
                            }
                        }
                    }
                }
            }
        }
        return this._professionKnownAbilities;
    }

    knowsProfessionAbility(abilityId: number): boolean {
        return this.allProfessionAbilities.has(abilityId);
    }
}
export type CharacterArray = ConstructorParameters<typeof Character>;
