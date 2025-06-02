import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import { get } from 'svelte/store';
import type { DateTime } from 'luxon';

import {
    difficultyMap,
    lockoutDifficultyOrder,
    lockoutDifficultyOrderMap,
} from '@/data/difficulty';
import { seasonMap } from '@/data/mythic-plus';
import { slotOrder } from '@/data/inventory-slot';
import { singleLockoutRaids } from '@/data/raid';
import { InventorySlot } from '@/enums/inventory-slot';
import { ItemBonusType } from '@/enums/item-bonus-type';
import { MythicPlusScoreType } from '@/enums/mythic-plus-score-type';
import { Region } from '@/enums/region';
import { TypedArray } from '@/enums/typed-array';
import { itemStore } from '@/stores/item';
import { sharedState } from '@/shared/state/shared.svelte';
import { staticStore } from '@/shared/stores/static';
import {
    Character,
    CharacterMythicPlusRunMember,
    Guild,
    UserDataCurrentPeriod,
    UserDataPet,
    WritableFancyStore,
} from '@/types';
import { WarbankItem } from '@/types/items';
import base64ToRecord from '@/utils/base64-to-record';
import { leftPad } from '@/utils/formatting';
import { getGenderedName } from '@/utils/get-gendered-name';
import getItemLevelQuality from '@/utils/get-item-level-quality';
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
import { getDungeonScores } from '@/utils/mythic-plus/get-dungeon-scores';
import type {
    CharacterLockout,
    CharacterMythicPlusRun,
    CharacterReputation,
    CharacterReputationReputation,
    UserAchievementData,
    UserData,
} from '@/types';
import type { Settings } from '@/shared/stores/settings/types';
import type { StaticData } from '@/shared/stores/static/types';
import type { ItemData, ItemDataItem } from '@/types/data/item';
import type { ContainsItems, HasNameAndRealm, UserItem } from '@/types/shared';

import { journalStore } from './journal';
import { userModifiedStore } from './user-modified';
import { wowthingData } from '@/shared/stores/data';
import { settingsState } from '@/shared/state/settings.svelte';
import { userState } from '@/user-home/state/user';

export class UserDataStore extends WritableFancyStore<UserData> {
    get dataUrl(): string {
        let url = document.getElementById('app')?.getAttribute('data-user');
        if (url) {
            const modified = get(userModifiedStore).general;
            url = url.replace('-0.json', `-${modified}.json`);
        }
        return url;
    }

    initialize(userData: UserData): void {
        console.time('UserDataStore.initialize');

        userState.general.process({ ...userData });

        // Background images
        userData.backgroundList = sortBy(Object.values(userData.backgrounds), (bg) => -bg.id);

        // Periods
        userData.currentPeriod = Object.fromEntries(
            Object.entries(userData.currentPeriod).map(([region, cp]) => [
                region,
                Object.assign(new UserDataCurrentPeriod(), cp),
            ]),
        );

        // Unpack packed data
        if (userData.mountsPacked !== null) {
            userData.hasMount = base64ToRecord(TypedArray.Uint16, userData.mountsPacked);
            userData.mountsPacked = null;
        }

        if (userData.toysPacked !== null) {
            userData.hasToyById = base64ToRecord(TypedArray.Uint16, userData.toysPacked);
            userData.toysPacked = null;
        }

        if (userData.petsRaw !== null) {
            userData.pets = {};
            userData.hasPet = {};
            for (const petId in userData.petsRaw) {
                userData.pets[petId] = userData.petsRaw[petId].map(
                    (petArray) => new UserDataPet(...petArray),
                );
                userData.hasPet[petId] = true;
            }
            userData.petsRaw = null;
        }

        // Transmog
        userData.hasAppearance = new Set<number>();
        userData.hasIllusion = new Set<number>(userData.illusionIds || []);
        userData.hasSource = new Set<string>();
        userData.hasSourceV2 = new Map();

        let lastAppearanceId = 0;
        for (const diffedAppearanceId of userData.rawAppearanceIds) {
            const appearanceId = diffedAppearanceId + lastAppearanceId;
            userData.hasAppearance.add(appearanceId);
            lastAppearanceId = appearanceId;
        }
        userData.rawAppearanceIds = null;

        for (let modifier = 0; modifier < 256; modifier++) {
            userData.hasSourceV2.set(modifier, new Set());
        }

        for (const [modifier, diffedItemIds] of getNumberKeyedEntries(
            userData.rawAppearanceSources,
        )) {
            let lastItemId = 0;
            for (const diffedItemId of diffedItemIds) {
                const itemId = diffedItemId + lastItemId;
                userData.hasSource.add(`${itemId}_${modifier}`);
                userData.hasSourceV2.get(modifier).add(itemId);
                lastItemId = itemId;
            }
        }
        userData.rawAppearanceSources = null;

        // Characters
        userData.maxReputation = new Map<number, number>();
        userData.characterMap = {};
        userData.charactersByConnectedRealm = {};
        userData.charactersByRealm = {};
        userData.characters = [];
        userData.hasRecipe = new Set<number>();
        for (const charArray of userData.charactersRaw || []) {
            const character = new Character();
            character.init(...charArray);
            userData.characters.push(character);
            userData.characterMap[character.id] = character;
        }
        userData.charactersRaw = null;

        userData.apiUpdatedCharacters = sortBy(
            userData.characters,
            (char) => -char.lastApiUpdate?.toUnixInteger() || 0,
        );

        // Guilds
        userData.guildMap = {};
        for (const guildArray of userData.guildsRaw || []) {
            const guild = new Guild(...guildArray);
            userData.guildMap[guild.id] = guild;
        }
        userData.guildsRaw = null;

        // Warbanks
        userData.warbankItems = [];
        for (const warbankItemArray of userData.rawWarbankItems || []) {
            const warbankItem = new WarbankItem(...warbankItemArray);
            userData.warbankItems.push(warbankItem);
        }
        userData.rawWarbankItems = null;

        // Temporary until static data loads
        // userData.allRegions = [1, 2, 3, 4];

        console.timeEnd('UserDataStore.initialize');
    }

    setup(
        settingsData: Settings,
        userData: UserData,
        // userAchievementData: UserAchievementData,
    ): void {
        console.time('UserDataStore.setup');

        const itemData = get(itemStore);
        const journalData = get(journalStore);
        const staticData = get(staticStore);

        this._itemCounts = {};

        // Initialize warbanks
        const temp: ContainsItems = {
            itemsByAppearanceId: {},
            itemsByAppearanceSource: {},
            itemsById: {},
        };
        userData.warbankItemsByItemId = groupBy(userData.warbankItems, (item) => item.itemId);
        for (const [itemId, items] of getNumberKeyedEntries(userData.warbankItemsByItemId)) {
            temp.itemsById[itemId] = items;

            for (const warbankItem of items) {
                const item = itemData.items[warbankItem.itemId];
                if (Object.values(item?.appearances || {}).length === 0) {
                    continue;
                }

                this.setAppearanceData(itemData, temp, warbankItem, item);
            }
        }

        userData.itemsByAppearanceId = Object.fromEntries(
            getNumberKeyedEntries(temp.itemsByAppearanceId).map(([key, value]) => [
                key,
                [[null as HasNameAndRealm, value]],
            ]),
        );
        userData.itemsByAppearanceSource = Object.fromEntries(
            Object.entries(temp.itemsByAppearanceSource).map(([key, value]) => [
                key,
                [[null as HasNameAndRealm, value]],
            ]),
        );
        userData.itemsById = Object.fromEntries(
            getNumberKeyedEntries(temp.itemsById).map(([key, value]) => [
                key,
                [[null as HasNameAndRealm, value]],
            ]),
        );

        // Initialize guilds
        for (const guild of Object.values(userData.guildMap)) {
            this.initializeGuild(itemData, guild);

            guild.realm = staticData.realms[guild.realmId] || staticData.realms[0];

            for (const [appearanceId, items] of getNumberKeyedEntries(guild.itemsByAppearanceId)) {
                (userData.itemsByAppearanceId[appearanceId] ||= []).push([guild, items]);
            }
            for (const [appearanceSource, items] of Object.entries(guild.itemsByAppearanceSource)) {
                (userData.itemsByAppearanceSource[appearanceSource] ||= []).push([guild, items]);
            }
            for (const [itemId, items] of getNumberKeyedEntries(guild.itemsById)) {
                (userData.itemsById[itemId] ||= []).push([guild, items]);
            }
        }

        // Initialize characters
        console.time('characters');
        userData.charactersByConnectedRealm = {};
        userData.charactersByRealm = {};
        const allLockouts: Record<string, [Character, CharacterLockout][]> = {};
        for (const character of userData.characters) {
            this.initializeCharacter(itemData, staticData, userData, character);

            for (const [key, lockout] of Object.entries(character.lockouts || {})) {
                // Addon gets the wrong ID for Uldir for some reason?
                if (key.startsWith('1028-')) {
                    character.lockouts[key.replace('1028', '1031')] = lockout;
                }
                // Ulduar tree elders show as unkilled, ugh
                else if (key.startsWith('759-') && !lockout.mangled) {
                    lockout.maxBosses = lockout.maxBosses - 3;
                    const newBosses = lockout.bosses.slice(0, 9); // up to Thorim
                    for (let i = 9; i <= 11; i++) {
                        if (lockout.bosses[i].dead) {
                            lockout.maxBosses++;
                            newBosses.push(lockout.bosses[i]);
                        }
                    }
                    newBosses.push(...lockout.bosses.slice(12)); // Freya onwards
                    lockout.bosses = newBosses;
                    lockout.mangled = true;
                }
            }

            for (const [key, lockout] of Object.entries(character.lockouts || {})) {
                (allLockouts[key] ||= []).push([character, lockout]);
            }

            if (
                sharedState.public ||
                settingsState.value.accounts?.[character.accountId]?.enabled === true
            ) {
                for (const [appearanceId, items] of getNumberKeyedEntries(
                    character.itemsByAppearanceId,
                )) {
                    (userData.itemsByAppearanceId[appearanceId] ||= []).push([character, items]);
                }
                for (const [appearanceSource, items] of Object.entries(
                    character.itemsByAppearanceSource,
                )) {
                    (userData.itemsByAppearanceSource[appearanceSource] ||= []).push([
                        character,
                        items,
                    ]);
                }
                for (const [itemId, items] of getNumberKeyedEntries(character.itemsById)) {
                    (userData.itemsById[itemId] ||= []).push([character, items]);
                }
            }

            for (const abilityId of character.allProfessionAbilities) {
                userData.hasRecipe.add(abilityId);
            }
        }

        console.timeEnd('characters');

        // Accounts
        userData.activeCharacters = [];
        for (const character of userData.characters) {
            if (
                sharedState.public ||
                settingsState.value.accounts?.[character.accountId]?.enabled === true
            ) {
                userData.activeCharacters.push(character);
            }
        }

        const regionSet = new Set<number>();
        for (const account of Object.values(userData.accounts)) {
            if (
                settingsState.value.accounts?.[account.id]?.enabled ||
                !settingsData.characters.hideDisabledAccounts
            ) {
                regionSet.add(account.region);
            }
        }

        userData.allRegions = Array.from(regionSet);

        // Pre-calculate lockouts
        userData.allLockouts = [];
        userData.allLockoutsMap = {};
        for (const [instanceDifficulty, characters] of Object.entries(allLockouts)) {
            const [instanceId, difficultyId] = instanceDifficulty
                .split('-')
                .map((s) => parseInt(s));
            const difficulty = difficultyMap[difficultyId];

            if (difficulty && instanceId) {
                const lockoutKey = singleLockoutRaids.has(instanceId)
                    ? `${instanceId}-`
                    : instanceDifficulty;

                if (!userData.allLockoutsMap[lockoutKey]) {
                    userData.allLockouts.push({
                        characters,
                        difficulty,
                        instanceId: instanceId,
                        key: lockoutKey,
                    });
                    userData.allLockoutsMap[lockoutKey] = userData.allLockouts.at(-1);
                } else {
                    userData.allLockoutsMap[lockoutKey].characters.push(...characters);
                }
            } else {
                console.log({ instanceId, difficultyId, difficulty });
            }
        }

        userData.allLockouts = sortBy(userData.allLockouts, (diff /*: InstanceDifficulty*/) => {
            const instance = staticData.instances[diff.instanceId];
            const journalInstance = journalData.instanceById[diff.instanceId];
            if (!diff.difficulty || !instance) {
                return 'z';
            }

            const orderIndex = 100 - (lockoutDifficultyOrderMap[diff.difficulty.id] || 99);
            return [
                leftPad(journalInstance?.order || 9999, 4, '0'),
                leftPad(orderIndex, 2, '0'),
                instance.shortName,
                diff.difficulty.shortName,
            ].join('|');
        });

        const instanceIds = uniq(settingsData.views.map((view) => view.homeLockouts).flat());
        userData.homeLockouts = [];
        for (const instanceId of instanceIds) {
            let found = false;
            for (const difficulty of lockoutDifficultyOrder) {
                const id = userData.allLockoutsMap[`${instanceId}-${difficulty}`];
                if (id !== undefined) {
                    userData.homeLockouts.push(id);
                    found = true;
                }
            }

            if (!found) {
                if (instanceId >= 10000000) {
                    const actualDifficulty = Math.floor(instanceId / 10000000);
                    const actualInstanceId = instanceId % 10000000;
                    userData.homeLockouts.push({
                        difficulty: difficultyMap[actualDifficulty],
                        instanceId: actualInstanceId,
                        key: `${actualInstanceId}-${actualDifficulty}`,
                    });
                } else {
                    userData.homeLockouts.push({
                        difficulty: null,
                        instanceId,
                        key: `${instanceId}-`,
                    });
                }
            }
        }

        // Toys
        userData.hasToy = {};
        for (const toyIdString of Object.keys(userData.hasToyById)) {
            const toyId = parseInt(toyIdString);
            const toy = staticData.toysById[toyId];
            if (toy) {
                userData.hasToy[toy.itemId] = true;
            } else {
                console.error('Missing toy id', toyId);
            }
        }

        // Transmog
        console.time('transmog');
        userData.appearanceMask = new Map<number, number>();
        for (const [appearanceIdString, items] of Object.entries(itemData.appearanceToItems)) {
            const appearanceId = parseInt(appearanceIdString);
            let mask = 0;

            for (const [itemId, modifier] of items) {
                // if (userData.hasSource.has(`${itemId}_${modifier}`)) {
                if (userData.hasSourceV2.get(modifier).has(itemId)) {
                    const item = itemData.items[itemId];
                    mask |= item.classMask;
                }
            }

            userData.appearanceMask.set(appearanceId, mask);
        }
        console.timeEnd('transmog');

        // HACK: Warglaives of Azzinoth
        // if (userAchievementData.achievements[426]) {
        //     userData.hasSource.add('32837_0');
        //     userData.hasSource.add('32838_0');
        // }

        console.timeEnd('UserDataStore.setup');
    }

    private initializeCharacter(
        itemData: ItemData,
        staticData: StaticData,
        userData: UserData,
        character: Character,
    ): void {
        // account
        character.account = this.value.accounts[character.accountId];

        // realm
        if (
            settingsState.value.accounts?.[character.accountId]?.enabled &&
            character.realmId > 0 &&
            character.realm
        ) {
            (this.value.charactersByRealm[character.realmId] ||= []).push(character);
            (this.value.charactersByConnectedRealm[character.realm.connectedRealmId] ||= []).push(
                character,
            );
        }

        // guild
        character.guild = this.value.guildMap[character.guildId];

        // item levels
        if (Object.keys(character.equippedItems).length > 0) {
            let count = 0,
                itemLevels = 0;
            for (let j = 0; j < slotOrder.length; j++) {
                const slot = slotOrder[j];
                const equippedItem = character.equippedItems[slot];
                if (equippedItem !== undefined) {
                    itemLevels += equippedItem.itemLevel;
                    count++;
                    if (
                        slot === InventorySlot.MainHand &&
                        character.equippedItems[InventorySlot.OffHand] === undefined
                    ) {
                        itemLevels += equippedItem.itemLevel;
                        count++;
                    }
                }
            }

            const itemLevel = itemLevels / count;
            character.calculatedItemLevel = itemLevel.toFixed(1);
        }

        if (character.calculatedItemLevel === undefined) {
            character.calculatedItemLevel = character.equippedItemLevel.toFixed(1);
        }

        character.calculatedItemLevelQuality = getItemLevelQuality(
            parseFloat(character.calculatedItemLevel),
        );

        // mythic+ seasons
        if (character.mythicPlus?.seasons) {
            for (const seasonId in seasonMap) {
                const season = seasonMap[seasonId];
                if (character.level >= season.minLevel) {
                    const characterSeason = character.mythicPlus.seasons[seasonId];
                    if (characterSeason !== undefined) {
                        for (let i = 0; i < season.orders.length; i++) {
                            for (let j = 0; j < season.orders[i].length; j++) {
                                const dungeonId = season.orders[i][j];
                                const runs = characterSeason[dungeonId] || [];
                                for (let runIndex = 0; runIndex < runs.length; runIndex++) {
                                    const run = runs[runIndex] as CharacterMythicPlusRun;

                                    // Members are packed arrays, convert them to useful objects
                                    run.memberObjects = (run.members || []).map(
                                        (m) => new CharacterMythicPlusRunMember(...m),
                                    );
                                }
                            }
                        }
                    }
                }
            }
        }

        character.mythicPlusSeasonScores = {};
        for (const seasonId in character.mythicPlusSeasons ?? {}) {
            const season = seasonMap[seasonId];
            let total = 0;
            for (const addonMap of Object.values(character.mythicPlusSeasons[seasonId])) {
                if (season?.scoreType === MythicPlusScoreType.FortifiedTyrannical) {
                    const scores = getDungeonScores(addonMap);
                    total += scores.fortifiedFinal + scores.tyrannicalFinal;
                } else {
                    total += addonMap.overallScore;
                }
            }

            const rioScore = character.raiderIo?.[seasonId]?.['all'] || 0;
            character.mythicPlusSeasonScores[seasonId] =
                Math.abs(total - rioScore) > 10 ? total : rioScore;
        }

        // professions
        // - force Archaeology to 950 max skill
        if (character.professions?.[794] !== undefined) {
            character.professions[794][794].maxSkill = 950;
        }

        // reputation sets
        character.reputationData = {};
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
                        repId =
                            character.faction === 0
                                ? reputation.alliance?.id
                                : reputation.horde?.id;
                    }

                    const repValue = character.reputations?.[repId];
                    if (
                        repValue !== undefined &&
                        repValue > (userData.maxReputation.get(repId) || -999999)
                    ) {
                        userData.maxReputation.set(repId, repValue);
                    }

                    setsData.push({
                        reputationId: repId,
                        value: character.reputations?.[repId] ?? -1,
                    });
                }

                catData.sets.push(setsData);
            }

            character.reputationData[category.slug] = catData;
        }

        // item appearance data
        character.itemsByAppearanceId = {};
        character.itemsByAppearanceSource = {};
        for (const characterItems of Object.values(character.itemsByLocation)) {
            for (const characterItem of characterItems) {
                const item = itemData.items[characterItem.itemId];
                if (Object.values(item?.appearances || {}).length === 0) {
                    continue;
                }

                this.setAppearanceData(itemData, character, characterItem, item);
            }
        }

        // console.log(character.realm.name, character.name, character.itemsByAppearanceId, character.itemsByAppearanceSource)
    }

    private initializeGuild(itemData: ItemData, guild: Guild): void {
        // item appearance data
        guild.itemsByAppearanceId = {};
        guild.itemsByAppearanceSource = {};
        guild.itemsById = {};
        for (const guildItem of guild.items) {
            (guild.itemsById[guildItem.itemId] ||= []).push(guildItem);

            const item = itemData.items[guildItem.itemId];
            if (Object.values(item?.appearances || {}).length === 0) {
                continue;
            }

            this.setAppearanceData(itemData, guild, guildItem, item);
        }
    }

    private setAppearanceData(
        itemData: ItemData,
        userContainer: ContainsItems,
        userItem: UserItem,
        item: ItemDataItem,
    ): void {
        let modifier = 0;
        let priority = 999;
        if (userItem.bonusIds.length > 0) {
            for (const bonusId of userItem.bonusIds) {
                const itemBonus = itemData.itemBonuses[bonusId];
                if (!(itemBonus?.bonuses?.length > 0)) {
                    continue;
                }

                for (const [bonusType, ...bonusValues] of itemBonus.bonuses) {
                    if (bonusType === ItemBonusType.SetItemAppearanceModifier) {
                        const bonusPriority = bonusValues[1] || 0;
                        if (bonusPriority < priority) {
                            modifier = bonusValues[0];
                            priority = bonusPriority;
                        }
                    }
                }
            }
        }

        userItem.appearanceId = item.appearances[modifier]?.appearanceId;
        if (userItem.appearanceId === undefined && modifier > 0) {
            modifier = 0;
            userItem.appearanceId = item.appearances[modifier]?.appearanceId;
        }
        userItem.appearanceModifier = modifier;
        userItem.appearanceSource = `${userItem.itemId}_${modifier}`;

        if (userItem.appearanceId !== undefined) {
            (userContainer.itemsByAppearanceId[userItem.appearanceId] ||= []).push(userItem);
            (userContainer.itemsByAppearanceSource[userItem.appearanceSource] ||= []).push(
                userItem,
            );
        }
    }

    public getCurrentPeriodForCharacter(
        now: DateTime,
        character: Character,
    ): UserDataCurrentPeriod {
        const regionId = character.realm?.region || 1;
        const period = this.value.currentPeriod[regionId];

        // Update the period if it's too old
        while (period.endTime < now) {
            period.id++;
            period.startTime = period.startTime.plus({ days: 7 });
            period.endTime = period.endTime.plus({ days: 7 });
        }

        return period;
    }

    public getPeriodForCharacter(now: DateTime, character: Character, desiredPeriodId: number) {
        const period = Object.assign(
            new UserDataCurrentPeriod(),
            this.getCurrentPeriodForCharacter(now, character),
        );

        while (period.id < desiredPeriodId) {
            period.id++;
            period.startTime = period.startTime.plus({ days: 7 });
            period.endTime = period.endTime.plus({ days: 7 });
        }

        while (period.id > desiredPeriodId) {
            period.id--;
            period.startTime = period.startTime.minus({ days: 7 });
            period.endTime = period.endTime.minus({ days: 7 });
        }

        return period;
    }

    public getPeriodForCharacter2(time: DateTime, character: Character) {
        const period = Object.assign(
            new UserDataCurrentPeriod(),
            this.getCurrentPeriodForCharacter(time, character),
        );

        while (period.startTime > time) {
            period.id--;
            period.startTime = period.startTime.minus({ days: 7 });
            period.endTime = period.endTime.minus({ days: 7 });
        }

        while (period.endTime < time) {
            period.id++;
            period.startTime = period.startTime.plus({ days: 7 });
            period.endTime = period.endTime.plus({ days: 7 });
        }

        period.starts = period.startTime.toISO();
        period.ends = period.endTime.toISO();

        return period;
    }

    private _itemCounts: Record<number, number> = {};
    public getItemCount(itemId: number): number {
        return (this._itemCounts[itemId] ||= this.value.characters
            .map((char) => char.getItemCount(itemId))
            .reduce((a, b) => a + b, 0));
    }
}

export const userStore = new UserDataStore();
