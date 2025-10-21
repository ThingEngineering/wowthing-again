import { DateTime } from 'luxon';
import { SvelteSet } from 'svelte/reactivity';

import { Constants } from '@/data/constants';
import { characterBagSlots, slotOrder } from '@/data/inventory-slot';
import { gemData } from '@/data/gems';
import { professionSpecializationToSpell } from '@/data/professions';
import { moveSpeedTalents } from '@/data/talents';
import { Faction } from '@/enums/faction';
import { InventorySlot } from '@/enums/inventory-slot';
import { ItemLocation } from '@/enums/item-location';
import { PlayableClass } from '@/enums/playable-class';
import { Profession } from '@/enums/profession';
import { StatType } from '@/enums/stat-type';
import { settingsState } from '@/shared/state/settings.svelte';
import { wowthingData } from '@/shared/stores/data';
import { getBestItemLevels } from '@/utils/characters/get-best-item-levels';
import { syncSet } from '@/utils/collections/sync-set';
import { leftPad } from '@/utils/formatting';
import { getCharacterLevel } from '@/utils/get-character-level';
import { getGenderedName } from '@/utils/get-gendered-name';
import getItemLevelQuality from '@/utils/get-item-level-quality';
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
import { initializeContainsItems } from '@/utils/items/initialize-contains-items';
import type { InventoryType } from '@/enums/inventory-type';
import type { Region } from '@/enums/region';
import type { StaticDataRealm } from '@/shared/stores/static/types';
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
import { CharacterProfession, type CharacterProfessionRaw } from './profession.svelte';
import type { CharacterRaiderIoSeason } from './raider-io-season';
import type {
    CharacterReputation,
    CharacterReputationParagon,
    CharacterReputationReputation,
} from './reputation';
import type { CharacterShadowlands } from './shadowlands';
import { CharacterSpecializationLoadout, type CharacterSpecializationRaw } from './specialization';
import {
    CharacterStatistics,
    CharacterStatisticBasic,
    CharacterStatisticMisc,
    CharacterStatisticRating,
    type CharacterStatisticBasicArray,
    type CharacterStatisticMiscArray,
    type CharacterStatisticRatingArray,
} from './statistics';
import { CharacterWeekly, type CharacterWeeklyArray } from './weekly.svelte';

import type { ContainsItems, HasNameAndRealm } from '../shared';
import type { Account } from '../account';
import type { CharacterAura } from './aura';
import type { CharacterPatronOrder } from './patron-order';
import type { CharacterMovementSpeed } from './movement-speed';
import { seasonMap } from '@/data/mythic-plus';
import { MythicPlusScoreType } from '@/enums/mythic-plus-score-type';
import { getDungeonScores } from '@/utils/mythic-plus';
import { ItemQuality } from '@/enums/item-quality';

export class Character implements ContainsItems, HasNameAndRealm {
    // Static
    public id: number;
    public accountId: number;
    public classId: number;
    public gender: number;
    public guildId: number;
    public raceId: number;
    public realmId: number;
    public name: string;
    public faction: Faction;

    // Static calculated
    public className: string;
    public raceName: string;
    public specializationName: string;

    public account: Account;
    public guild: Guild;
    public realm: StaticDataRealm;
    public region: Region;

    // Reactive
    public activeSpecId = $state(0);
    public equippedItemLevel = $state(0);
    public gold = $state(0);
    public level = $state(0);
    public levelXp = $state(0);
    public playedTotal = $state(0);
    public restedExperience = $state(0);

    public chromieTime = $state(false);
    public isResting = $state(false);
    public isWarMode = $state(false);

    public currentLocation = $state<string>(undefined);
    public hearthLocation = $state<string>(undefined);

    public dailyReset: DateTime = $state<DateTime>(undefined);
    public weeklyReset: DateTime = $state<DateTime>(undefined);
    public lastApiUpdate: DateTime = $state<DateTime>(undefined);
    public lastApiUpdateUnix = $state(0);
    public lastSeenAddon: DateTime = $state<DateTime>(undefined);
    public lastSeenAddonUnix = $state(0);
    public scannedCurrencies: DateTime = $state<DateTime>(undefined);
    public scannedCurrenciesUnix = $state(0);

    // Calculated
    public bags: Record<number, number> = $state({});
    public currencies: Record<number, CharacterCurrency> = $state({});
    public equippedItems: Record<number, CharacterEquippedItem> = $state({});
    public itemsByAppearanceId: Record<number, CharacterItem[]> = $state.raw({});
    public itemsByAppearanceSource: Record<string, CharacterItem[]> = $state.raw({});
    public itemsById: Record<number, CharacterItem[]> = $state.raw({});
    public itemsByLocation: Record<number, CharacterItem[]> = $state.raw({});
    public knownRecipes = new SvelteSet<number>();
    public mythicPlusSeasonScores: Record<number, number> = $state({});
    public mythicPlusSeasons: Record<number, Record<number, CharacterMythicPlusAddonMap>> = $state(
        {}
    );
    public mythicPlusWeeks: Record<number, CharacterMythicPlusAddonRun[]> = $state({});
    public professionSpecializations: Record<number, number> = $state({});
    public specializations: Record<number, CharacterSpecializationLoadout[]> = $state({});
    public statistics: CharacterStatistics = new CharacterStatistics();
    public weekly: CharacterWeekly = new CharacterWeekly();

    public configuration: CharacterConfiguration;

    public auras: Record<number, CharacterAura> = $state({});
    public garrisons: Record<number, CharacterGarrison> = $state({});
    public garrisonTrees: Record<number, Record<number, number[]>> = $state({});
    public highestItemLevel: Record<number, number> = $state({});
    public knownSpells: number[] = $state([]);
    public lockouts: Record<string, CharacterLockout> = $state({});
    public mythicPlus: CharacterMythicPlus;
    public mythicPlusAddon: Record<number, CharacterMythicPlusAddon> = $state({});
    public paragons: Record<number, CharacterReputationParagon> = $state({});
    public patronOrders: Record<number, CharacterPatronOrder[]> = $state({});
    public professions: Record<number, CharacterProfession> = $state({});
    public professionCooldowns: Record<string, [number, number, number]> = $state({});
    // public professionTraits: Record<number, Record<number, number>> = $state({});
    public raiderIo: Record<number, CharacterRaiderIoSeason> = $state({});
    public reputations: Record<number, number> = $state({});
    public shadowlands: CharacterShadowlands;

    init(
        id: number,
        name: string,
        isResting: number,
        isWarMode: number,
        accountId: number,
        activeSpecId: number,
        level: number,
        levelXp: number,
        chromieTime: number,
        classId: number,
        equippedItemLevel: number,
        faction: Faction,
        gender: number,
        guildId: number,
        playedTotal: number,
        raceId: number,
        realmId: number,
        restedExperience: number,
        gold: number,
        currentLocation: string,
        hearthLocation: string,
        lastApiUpdateUnix: number,
        lastSeenAddonUnix: number,
        dailyResetUnix: number,
        weeklyResetUnix: number,
        scannedCurrenciesUnix: number,

        configuration: CharacterConfiguration,

        auras: Record<number, CharacterAura>,
        rawEquippedItems: Record<number, CharacterEquippedItemArray>,
        garrisons: Record<number, CharacterGarrison>,
        garrisonTrees: Record<number, Record<number, number[]>>,
        highestItemLevel: Record<number, number>,
        knownSpells: number[],
        lockouts: Record<string, CharacterLockout>,
        mythicPlus: CharacterMythicPlus,
        mythicPlusAddon: Record<number, CharacterMythicPlusAddon>,
        rawMythicPlusSeasons: Record<number, Record<number, CharacterMythicPlusAddonMapArray>>,
        paragons: Record<number, CharacterReputationParagon>,
        patronOrders: Record<number, CharacterPatronOrder[]>,
        professions: Record<number, Record<number, CharacterProfessionRaw>>,
        professionCooldowns: Record<string, [number, number, number]>,
        professionSpecializations: Record<number, string>,
        professionTraits: Record<number, Record<number, number>>,
        raiderIo: Record<number, CharacterRaiderIoSeason>,
        reputations: Record<number, number>,
        shadowlands: CharacterShadowlands,
        rawWeekly: CharacterWeeklyArray,

        rawCurrencies: CharacterCurrencyArray[],
        rawItems: CharacterItemArray[],
        rawMythicPlusWeeks: Record<number, CharacterMythicPlusAddonRunArray[]>,
        specializations: Record<number, CharacterSpecializationRaw>,
        rawStatistics: [
            CharacterStatisticBasicArray[],
            CharacterStatisticMiscArray[],
            CharacterStatisticRatingArray[],
        ]
    ) {
        this.id = id;
        this.name = name;
        this.isResting = isResting === 1;
        this.isWarMode = isWarMode === 1;
        this.accountId = accountId;
        this.activeSpecId = activeSpecId;
        this.level = level;
        this.levelXp = levelXp;
        this.chromieTime = chromieTime === 1;
        this.classId = classId;
        this.equippedItemLevel = equippedItemLevel;
        this.faction = faction;
        this.gender = gender;
        this.guildId = guildId;
        this.playedTotal = playedTotal;
        this.raceId = raceId;
        this.realmId = realmId;
        this.restedExperience = restedExperience;
        this.gold = gold;
        this.currentLocation = currentLocation;
        this.hearthLocation = hearthLocation;
        this.lastApiUpdateUnix = lastApiUpdateUnix;
        this.lastSeenAddonUnix = lastSeenAddonUnix;
        this.scannedCurrenciesUnix = scannedCurrenciesUnix;

        this.configuration = configuration;
        this.auras = auras;
        // rawEquippedItems
        this.garrisons = garrisons;
        this.garrisonTrees = garrisonTrees;
        this.highestItemLevel = highestItemLevel;
        this.knownSpells = knownSpells;
        this.lockouts = lockouts || {};
        this.mythicPlus = mythicPlus;
        this.mythicPlusAddon = mythicPlusAddon;
        this.paragons = paragons;
        this.patronOrders = patronOrders;
        // this.professions = professions;
        this.professionCooldowns = professionCooldowns;
        // professionSpecializations;
        // this.professionTraits = professionTraits;
        this.raiderIo = raiderIo;
        this.reputations = reputations;
        this.shadowlands = shadowlands;
        // rawWeekly
        // rawCurrenices
        // rawItems
        // rawMythicPlusWeeks
        // rawSpecializations
        // rawStatistics

        // account relies on UserStore data
        // guild relies on UserStore data
        this.realm =
            wowthingData.static.realmById.get(this.realmId) || wowthingData.static.realmById.get(0);
        this.region = this.realm.region;

        // names
        this.className = getGenderedName(
            wowthingData.static.characterClassById.get(this.classId).name,
            this.gender
        );
        this.raceName = getGenderedName(
            wowthingData.static.characterRaceById.get(this.raceId).name,
            this.gender
        );
        if (this.activeSpecId > 0) {
            this.specializationName = getGenderedName(
                wowthingData.static.characterSpecializationById.get(this.activeSpecId).name,
                this.gender
            );
        }

        // professions
        // TODO diff update this
        this.professions = {};
        for (const [professionId, professionData] of getNumberKeyedEntries(professions || {})) {
            const profession = (this.professions[professionId] = new CharacterProfession(
                professionId
            ));
            profession.process(professionData, professionTraits || {});
        }

        const cooking = this.professions[Profession.Cooking];
        const pandaCooking = cooking?.subProfessions?.[2544];
        if (pandaCooking) {
            const pandaRecipes = new Set<number>();
            for (let skillLineId = 975; skillLineId <= 980; skillLineId++) {
                const skillLine = cooking.subProfessions[skillLineId];
                if (skillLine) {
                    for (const abilityId of skillLine.knownRecipes || []) {
                        pandaRecipes.add(abilityId);
                    }
                }
            }
            syncSet(pandaCooking.knownRecipes, pandaRecipes);
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

        this.itemsByLocation = {};
        for (const locationValue of Object.values(ItemLocation)) {
            if (!isNaN(Number(locationValue))) {
                this.itemsByLocation[locationValue as number] = [];
            }
        }

        if (rawWeekly) {
            this.weekly.process(...rawWeekly);
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

        // Remix: Legion hack - fix artifact off-hand item level
        const mainHand = this.equippedItems[InventorySlot.MainHand];
        const offHand = this.equippedItems[InventorySlot.OffHand];
        if (
            mainHand?.quality === ItemQuality.Artifact &&
            offHand?.quality === ItemQuality.Artifact &&
            offHand.itemLevel < mainHand.itemLevel
        ) {
            offHand.itemLevel = mainHand.itemLevel;
        }

        const items: CharacterItem[] = [];
        for (const rawItem of rawItems || []) {
            const obj = new CharacterItem(...rawItem);
            if (obj.slot === 0) {
                this.bags[obj.bagId] = obj.itemId;
            } else {
                items.push(obj);
                this.itemsByLocation[obj.location].push(obj);
            }
        }

        // itemsByAppearanceId, itemsByAppearanceSource, itemsById
        initializeContainsItems(this, items);

        for (const [itemId, itemIdItems] of getNumberKeyedEntries(this.itemsById)) {
            this._itemCounts[itemId] = itemIdItems.reduce((a, b) => a + b.count, 0);
        }

        for (const equippedItem of Object.values(this.equippedItems)) {
            this._itemCounts[equippedItem.itemId] =
                (this._itemCounts[equippedItem.itemId] || 0) + 1;
        }

        if (this.mythicPlus?.rawSeasons) {
            this.mythicPlus.seasons = {};
            for (const [seasonId, seasonData] of getNumberKeyedEntries(
                this.mythicPlus.rawSeasons || {}
            )) {
                this.mythicPlus.seasons[seasonId] = {};
                for (const [mapId, runArrays] of getNumberKeyedEntries(seasonData)) {
                    this.mythicPlus.seasons[seasonId][mapId] = runArrays.map(
                        (runArray) => new CharacterMythicPlusRun(...runArray)
                    );
                }
            }
            this.mythicPlus.rawSeasons = null;
        }

        if (this.mythicPlusAddon) {
            for (const seasonData of Object.values(this.mythicPlusAddon)) {
                if (seasonData.rawRuns) {
                    seasonData.runs = (seasonData.rawRuns || []).map(
                        (runArray) => new CharacterMythicPlusAddonRun(...runArray)
                    );
                    seasonData.rawRuns = null;
                }
            }
        }

        for (const [seasonId, seasonData] of getNumberKeyedEntries(rawMythicPlusSeasons || {})) {
            this.mythicPlusSeasons[seasonId] = {};
            for (const [mapId, mapArray] of getNumberKeyedEntries(seasonData)) {
                this.mythicPlusSeasons[seasonId][mapId] = new CharacterMythicPlusAddonMap(
                    ...mapArray
                );
            }
        }

        for (const [seasonId, addonMaps] of getNumberKeyedEntries(this.mythicPlusSeasons ?? {})) {
            const season = seasonMap[seasonId];
            let total = 0;
            for (const addonMap of Object.values(addonMaps)) {
                if (season?.scoreType === MythicPlusScoreType.FortifiedTyrannical) {
                    const scores = getDungeonScores(addonMap);
                    total += scores.fortifiedFinal + scores.tyrannicalFinal;
                } else {
                    total += addonMap.overallScore;
                }
            }

            const rioScore = this.raiderIo?.[seasonId]?.['all'] || 0;
            this.mythicPlusSeasonScores[seasonId] =
                Math.abs(total - rioScore) > 10 ? total : rioScore;
        }

        for (const [week, runsArray] of Object.entries(rawMythicPlusWeeks || {})) {
            this.mythicPlusWeeks[parseInt(week)] = runsArray.map(
                (runArray) => new CharacterMythicPlusAddonRun(...runArray)
            );
        }

        for (const [specId, spec] of getNumberKeyedEntries(specializations || {})) {
            this.specializations[specId] = spec.loadouts.map(
                (loadout) => new CharacterSpecializationLoadout(loadout)
            );
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

        if (dailyResetUnix && dailyResetUnix > Constants.defaultUnixTime) {
            this.dailyReset = DateTime.fromSeconds(dailyResetUnix);
        }

        if (weeklyResetUnix && weeklyResetUnix > Constants.defaultUnixTime) {
            this.weeklyReset = DateTime.fromSeconds(weeklyResetUnix);
        }

        if (scannedCurrenciesUnix && scannedCurrenciesUnix > Constants.defaultUnixTime) {
            this.scannedCurrencies = DateTime.fromSeconds(scannedCurrenciesUnix);
        }
    }

    hidden = $derived.by(
        () =>
            settingsState.value.characters.hiddenCharacters?.includes(this.id) ||
            (settingsState.value.characters.hideDisabledAccounts && this.account?.enabled === false)
    );
    ignored = $derived.by(
        () => this.hidden || settingsState.value.characters.ignoredCharacters?.includes(this.id)
    );

    calculatedItemLevel = $derived.by(() => {
        let calced: string = undefined;
        if (Object.keys(this.equippedItems).length > 0) {
            let count = 0,
                itemLevels = 0;
            for (let j = 0; j < slotOrder.length; j++) {
                const slot = slotOrder[j];
                const equippedItem = this.equippedItems[slot];
                if (equippedItem !== undefined) {
                    itemLevels += equippedItem.itemLevel;
                    count++;
                    if (
                        slot === InventorySlot.MainHand &&
                        this.equippedItems[InventorySlot.OffHand] === undefined
                    ) {
                        itemLevels += equippedItem.itemLevel;
                        count++;
                    }
                }
            }

            const itemLevel = itemLevels / count;
            calced = itemLevel.toFixed(1);
        }

        return calced || this.equippedItemLevel.toFixed(1);
    });

    public calculatedItemLevelQuality = $derived.by(() =>
        getItemLevelQuality(parseFloat(this.calculatedItemLevel))
    );

    public fancyLevel = $derived.by(() => {
        const levelData = getCharacterLevel(this);
        if (levelData.level < Constants.characterMaxLevel) {
            return `${leftPad(levelData.level, 2, '&nbsp;')}.${levelData.partial}`;
        } else {
            return `${leftPad(levelData.level, 2, '&nbsp;')}&nbsp;&nbsp;`;
        }
    });

    get isMaxLevel(): boolean {
        return this.level === Constants.characterMaxLevel;
    }

    public isRemix = $derived(!!this.auras?.[Constants.remixLegionSpellId]);

    public lockoutKeys = $derived(Object.keys(this.lockouts || {}));

    private _bagSlots = $derived.by(() => {
        // Vulpera get 8 extra bag slots
        let free = this.raceId === 35 ? 28 : 20;
        let total = free;

        for (const bagSlot of characterBagSlots.filter((n) => n !== 5)) {
            const itemId = this.bags[bagSlot];
            const bag = wowthingData.static.bagById.get(itemId);
            if (bag) {
                free += bag.slots;
                total += bag.slots;
            }
        }

        for (const item of this.itemsByLocation[ItemLocation.Bags] || []) {
            if (item.bagId !== 5 && item.slot > 0) {
                free--;
            }
        }

        return { free, total };
    });
    get bagSlotsFree(): number {
        return this._bagSlots.free;
    }
    get bagSlotsTotal(): number {
        return this._bagSlots.total;
    }

    public bestItemLevels: Record<number, [string, InventoryType[]]>;
    getBestItemLevels(): Record<number, [string, InventoryType[]]> {
        this.bestItemLevels ||= getBestItemLevels(this);
        return this.bestItemLevels;
    }

    private _itemCounts: Record<number, number>;
    getItemCount(itemId: number): number {
        return this._itemCounts[itemId] || 0;
    }

    public activeSpecializationLoadout = $derived.by(() => {
        return this.specializations[this.activeSpecId]?.find((loadout) => loadout.active);
    });

    public allProfessionAbilities = $derived.by(() => {
        const allKnown = new Set<number>();
        for (const profession of Object.values(this.professions)) {
            for (const abilityId of profession.knownRecipes) {
                allKnown.add(abilityId);
            }
        }
        return allKnown;
    });

    knowsProfessionAbility(abilityId: number): boolean {
        return this.allProfessionAbilities.has(abilityId);
    }

    public gemIds = $derived.by(() => {
        return Object.values(this.equippedItems)
            .map((item) => item.gemIds)
            .flat();
    });

    public movementSpeed = $derived.by(() => {
        const ret: CharacterMovementSpeed = {
            enchants: 0,
            gems: 0,
            rating: 0,
            shapeshift: 0,
            talents: 0,
            total: 0,
        };

        ret.rating = (this.statistics?.rating?.[StatType.SpeedRating]?.ratingBonus || 0) / 100;

        // Minor Move Speed gives 10%
        ret.enchants =
            this.equippedItems?.[InventorySlot.Feet]?.enchantmentIds?.[0] === 911 ? 10 : 0;

        // Elusive Blasphemite, 2% move speed per unique gem color?
        const gemIds = new Set(this.gemIds);
        if (gemData.theWarWithin.elusiveBlasphemite.some((gemId) => gemIds.has(gemId))) {
            let gemCount = 0;

            for (const [, colorGemIds] of Object.entries(gemData.theWarWithin).filter(
                ([key]) => key !== 'elusiveBlasphemite'
            )) {
                if (colorGemIds.some((gemId) => gemIds.has(gemId))) {
                    gemCount++;
                }
            }

            ret.gems = gemCount * 2;

            // Prismatic Null Stone gives a 25% bonus
            if (ret.gems > 0) {
                const enchantCount = Math.min(
                    2,
                    Object.values(this.equippedItems || {}).filter((item) =>
                        item.bonusIds?.includes(10518)
                    ).length
                );
                ret.gems = ret.gems * (1 + 0.25 * enchantCount);
            }
        }

        // Shapeshift
        if (this.classId === PlayableClass.Druid) {
            ret.shapeshift = 30;
        } else if (this.classId === PlayableClass.Shaman) {
            ret.shapeshift = 40;
        }

        // Talents
        const activeLoadout = this.activeSpecializationLoadout;
        if (activeLoadout?.talents) {
            for (const [nodeId, rankData] of moveSpeedTalents) {
                const charTalent = activeLoadout.talents[nodeId];
                if (charTalent && (rankData[0] === 0 || charTalent[1] === rankData[0])) {
                    ret.talents += rankData[charTalent[0]];
                }
            }
        }

        ret.total = Math.round(ret.enchants + ret.gems + ret.rating + ret.shapeshift + ret.talents);

        return ret;
    });

    reputationData = $derived.by(() => {
        const ret: Record<string, CharacterReputation> = {};
        for (const category of wowthingData.manual.reputationSets) {
            if (category === null) {
                continue;
            }

            const catData: CharacterReputation = {
                sets: [],
            };

            for (const sets of category.reputations) {
                const setsData: CharacterReputationReputation[] = [];

                for (const reputation of sets) {
                    let repId: number;
                    if (reputation.both) {
                        repId = reputation.both.id;
                    } else {
                        repId = this.faction === 0 ? reputation.alliance?.id : reputation.horde?.id;
                    }

                    setsData.push({
                        reputationId: repId,
                        value: this.reputations[repId] ?? -1,
                    });
                }

                catData.sets.push(setsData);
            }

            ret[category.slug] = catData;
        }
        return ret;
    });
}
export type CharacterArray = Parameters<Character['init']>;
