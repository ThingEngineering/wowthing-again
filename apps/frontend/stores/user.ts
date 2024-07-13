import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import { get } from 'svelte/store';
import type { DateTime } from 'luxon';

import { userModifiedStore } from './user-modified';
import { difficultyMap, lockoutDifficultyOrder } from '@/data/difficulty';
import { seasonMap } from '@/data/dungeon';
import { slotOrder } from '@/data/inventory-slot';
import { InventorySlot } from '@/enums/inventory-slot';
import { ItemBonusType } from '@/enums/item-bonus-type';
import { TypedArray } from '@/enums/typed-array';
import { itemStore } from '@/stores/item';
import { staticStore } from '@/shared/stores/static';
import {
    Character,
    CharacterMythicPlusRunMember,
    Guild,
    UserDataCurrentPeriod,
    UserDataPet,
    WritableFancyStore,
} from '@/types';
import base64ToRecord from '@/utils/base64-to-record';
import { leftPad } from '@/utils/formatting';
import { getGenderedName } from '@/utils/get-gendered-name';
import getItemLevelQuality from '@/utils/get-item-level-quality';
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
import { getDungeonScores } from '@/utils/mythic-plus/get-dungeon-scores';
import type {
    Account,
    CharacterMythicPlusRun,
    CharacterReputation,
    CharacterReputationReputation,
    UserAchievementData,
    UserData,
} from '@/types';
import type { Settings } from '@/shared/stores/settings/types';
import type { StaticData } from '@/shared/stores/static/types';
import type { ItemData, ItemDataItem } from '@/types/data/item';
import type { ContainsItems, UserItem } from '@/types/shared';

export class UserDataStore extends WritableFancyStore<UserData> {
    get dataUrl(): string {
        let url = document.getElementById('app')?.getAttribute('data-user');
        if (url) {
            const modified = get(userModifiedStore).general;
            url = url.replace('-0.json', `-${modified}.json`);
        }
        return url;
    }

    get useAccountTags(): boolean {
        return Object.values(get(this).accounts).some((a: Account) => !!a.tag);
    }

    initialize(userData: UserData): void {
        console.time('UserDataStore.initialize');

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
        userData.hasIllusion = new Set<number>(userData.illusionIds || []);

        userData.hasAppearance = new Set<number>();
        let lastAppearanceId = 0;
        for (const diffedAppearanceId of userData.rawAppearanceIds) {
            const appearanceId = diffedAppearanceId + lastAppearanceId;
            userData.hasAppearance.add(appearanceId);
            lastAppearanceId = appearanceId;
        }
        userData.rawAppearanceIds = null;

        userData.hasSource = new Set<string>();
        for (const [modifier, diffedItemIds] of getNumberKeyedEntries(
            userData.rawAppearanceSources,
        )) {
            let lastItemId = 0;
            for (const diffedItemId of diffedItemIds) {
                const itemId = diffedItemId + lastItemId;
                userData.hasSource.add(`${itemId}_${modifier}`);
                lastItemId = itemId;
            }
        }
        userData.rawAppearanceSources = null;

        // Characters
        userData.characterMap = {};
        userData.charactersByConnectedRealm = {};
        userData.charactersByRealm = {};
        userData.characters = [];
        for (const charArray of userData.charactersRaw || []) {
            const character = new Character(...charArray);
            userData.characters.push(character);
            userData.characterMap[character.id] = character;
        }
        userData.charactersRaw = null;

        // Guilds
        userData.guildMap = {};
        for (const guildArray of userData.guildsRaw || []) {
            const guild = new Guild(...guildArray);
            userData.guildMap[guild.id] = guild;
        }

        // Temporary until static data loads
        userData.allRegions = [1, 2, 3, 4];

        console.timeEnd('UserDataStore.initialize');
    }

    setup(
        settingsData: Settings,
        userData: UserData,
        userAchievementData: UserAchievementData,
    ): void {
        console.time('UserDataStore.setup');

        const itemData = get(itemStore);
        const staticData = get(staticStore);

        this._itemCounts = {};
        userData.itemsByAppearanceId = {};
        userData.itemsByAppearanceSource = {};
        userData.itemsById = {};

        // Initialize guilds
        for (const guild of Object.values(userData.guildMap)) {
            this.initializeGuild(itemData, guild);

            guild.realm = staticData.realms[guild.realmId] || staticData.realms[0];

            for (const [appearanceId, items] of Object.entries(guild.itemsByAppearanceId)) {
                (userData.itemsByAppearanceId[parseInt(appearanceId)] ||= []).push([guild, items]);
            }
            for (const [appearanceSource, items] of Object.entries(guild.itemsByAppearanceSource)) {
                (userData.itemsByAppearanceSource[appearanceSource] ||= []).push([guild, items]);
            }
            for (const [itemId, items] of Object.entries(guild.itemsById)) {
                (userData.itemsById[parseInt(itemId)] ||= []).push([guild, items]);
            }
        }

        // Initialize characters
        userData.charactersByConnectedRealm = {};
        userData.charactersByRealm = {};
        const allLockouts: Record<string, boolean> = {};
        for (const character of userData.characters) {
            this.initializeCharacter(itemData, staticData, character);

            for (const key of Object.keys(character.lockouts || {})) {
                allLockouts[key] = true;
            }

            if (userData.public || character.account?.enabled === true) {
                for (const [appearanceId, items] of Object.entries(character.itemsByAppearanceId)) {
                    (userData.itemsByAppearanceId[parseInt(appearanceId)] ||= []).push([
                        character,
                        items,
                    ]);
                }
                for (const [appearanceSource, items] of Object.entries(
                    character.itemsByAppearanceSource,
                )) {
                    (userData.itemsByAppearanceSource[appearanceSource] ||= []).push([
                        character,
                        items,
                    ]);
                }
                for (const [itemId, items] of Object.entries(character.itemsById)) {
                    (userData.itemsById[parseInt(itemId)] ||= []).push([character, items]);
                }
            }
        }

        userData.allRegions = sortBy(
            uniq(userData.characters.map((char) => char.realm.region)),
            (region) => region,
        );

        // Accounts
        userData.activeCharacters = [];
        for (const character of userData.characters) {
            if (userData.public || character.account?.enabled === true) {
                userData.activeCharacters.push(character);
            }
        }

        // Pre-calculate lockouts
        userData.allLockouts = [];
        userData.allLockoutsMap = {};
        for (const instanceDifficulty of Object.keys(allLockouts)) {
            const [instanceId, difficultyId] = instanceDifficulty.split('-');
            const difficulty = difficultyMap[parseInt(difficultyId)];

            if (difficulty && instanceId) {
                userData.allLockouts.push({
                    difficulty,
                    instanceId: parseInt(instanceId),
                    key: instanceDifficulty,
                });
                userData.allLockoutsMap[instanceDifficulty] =
                    userData.allLockouts[userData.allLockouts.length - 1];
            } else {
                console.log({ instanceId, difficultyId, difficulty });
            }
        }

        userData.allLockouts = sortBy(userData.allLockouts, (diff /*: InstanceDifficulty*/) => {
            const instance = staticData.instances[diff.instanceId];
            if (!diff.difficulty || !instance) {
                return 'z';
            }

            const orderIndex = lockoutDifficultyOrder.indexOf(diff.difficulty.id);
            return [
                leftPad(100 - instance.expansion, 2, '0'),
                leftPad(orderIndex >= 0 ? orderIndex : 99, 2, '0'),
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
                userData.homeLockouts.push({
                    difficulty: null,
                    instanceId,
                    key: `${instanceId}-`,
                });
            }
        }

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
        userData.appearanceMask = new Map<number, number>();
        for (const [appearanceIdString, items] of Object.entries(itemData.appearanceToItems)) {
            const appearanceId = parseInt(appearanceIdString);
            let mask = 0;

            for (const [itemId, modifier] of items) {
                if (userData.hasSource.has(`${itemId}_${modifier}`)) {
                    const item = itemData.items[itemId];
                    mask |= item.classMask;
                }
            }

            userData.appearanceMask.set(appearanceId, mask);
        }

        // HACK: Warglaives of Azzinoth
        if (userAchievementData.achievements[426]) {
            userData.hasSource.add('32837_0');
            userData.hasSource.add('32838_0');
        }

        console.timeEnd('UserDataStore.setup');
    }

    private initializeCharacter(
        itemData: ItemData,
        staticData: StaticData,
        character: Character,
    ): void {
        // account
        character.account = this.value.accounts[character.accountId];

        // names
        character.className = getGenderedName(
            staticData.characterClasses[character.classId].name,
            character.gender,
        );
        character.raceName = getGenderedName(
            staticData.characterRaces[character.raceId].name,
            character.gender,
        );
        if (character.activeSpecId > 0) {
            character.specializationName = getGenderedName(
                staticData.characterSpecializations[character.activeSpecId].name,
                character.gender,
            );
        }

        // realm
        character.realm = staticData.realms[character.realmId] || staticData.realms[0];
        if (character.account?.enabled && character.realmId > 0 && character.realm) {
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
            let total = 0;
            for (const addonMap of Object.values(character.mythicPlusSeasons[seasonId])) {
                const scores = getDungeonScores(addonMap);
                total += scores.fortifiedFinal + scores.tyrannicalFinal;
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
        for (const category of staticData.reputationSets) {
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
        character.itemsById = {};
        for (const characterItems of Object.values(character.itemsByLocation)) {
            for (const characterItem of characterItems) {
                (character.itemsById[characterItem.itemId] ||= []).push(characterItem);

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

    private _itemCounts: Record<number, number> = {};
    public getItemCount(itemId: number): number {
        return (this._itemCounts[itemId] ||= this.value.characters
            .map((char) => char.getItemCount(itemId))
            .reduce((a, b) => a + b, 0));
    }
}

export const userStore = new UserDataStore();
