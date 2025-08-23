import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import { SvelteMap, SvelteSet } from 'svelte/reactivity';

import {
    difficultyMap,
    lockoutDifficultyOrder,
    lockoutDifficultyOrderMap,
} from '@/data/difficulty';
import { singleLockoutRaids } from '@/data/raid';
import { TypedArray } from '@/enums/typed-array';
import { settingsState } from '@/shared/state/settings.svelte';
import { wowthingData } from '@/shared/stores/data';
import {
    Character,
    Guild,
    UserDataCurrentPeriod,
    UserDataPet,
    type Account,
    type CharacterLockout,
    type InstanceDifficulty,
    type InstanceLockout,
    type UserData,
} from '@/types';
import { base64ToArray } from '@/utils/base64';
import { leftPad } from '@/utils/formatting';
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
import { sharedState } from '@/shared/state/shared.svelte';
import { WarbankItem } from '@/types/items';
import type { Faction } from '@/enums/faction';
import { logErrors } from '@/utils/log-errors';
import type { HasNameAndRealm } from '@/types/shared/has-name-and-realm';
import type { UserItem } from '@/types/shared/user-item';

export class DataUserGeneral {
    public accountById: Record<number, Account> = $state({});
    public characters: Character[] = $state([]);
    public characterById: Record<number, Character> = $state({});
    public currentPeriod: Record<number, UserDataCurrentPeriod> = $state({});
    public guildById: Record<number, Guild> = $state({});
    public petsById: Record<number, UserDataPet[]> = $state({});
    public warbankItems: WarbankItem[] = $state([]);
    public warbankItemsByItemId: Record<number, WarbankItem[]> = $state.raw({});

    public honorCurrent = $state(0);
    public honorLevel = $state(0);
    public honorMax = $state(0);
    public warbankGold = $state(0);

    public hasAppearanceById = new SvelteSet<number>();
    public hasAppearanceBySource = new SvelteSet<number>();
    public hasIllusionByEnchantmentId = new SvelteSet<number>();
    public hasMountById = new SvelteSet<number>();
    public hasPetById = new SvelteSet<number>();
    public hasToyById = new SvelteSet<number>();
    public hasToyByItemId = new SvelteSet<number>();
    public heirlooms = new SvelteMap<number, number>();

    public activeCharacters = $derived.by(() => this._activeCharacters());
    public allLockouts = $derived.by(() => this._lockoutData().allLockouts);
    public allRegions = $derived.by(() => this._allRegions());
    public charactersByConnectedRealmId = $derived.by(() => this._charactersByConnectedRealmId());
    public charactersByRealmId = $derived.by(() => this._charactersByRealmId());
    public homeLockouts = $derived.by(() => this._homeLockouts());
    public itemsById = $derived.by(() => logErrors(() => this._itemsById()));
    public visibleCharacters = $derived.by(() => this._visibleCharacters());

    private _warbankScannedAt: string;

    public process(userData: UserData): void {
        console.time('DataUserGeneral.process');

        this.accountById = userData.accounts;

        // Create or update Guild objects
        for (const guildArray of userData.guildsRaw) {
            const guild = new Guild();
            guild.init(...guildArray);
            this.guildById[guild.id] = guild;
        }

        // Create or update Character objects
        for (const characterArray of userData.charactersRaw) {
            const characterId = characterArray[0];
            let character = this.characterById[characterId];
            const existed = !!character;

            if (existed) {
                const lastApiUpdateUnix = characterArray[21];
                const lastSeenAddonUnix = characterArray[22];
                if (
                    lastApiUpdateUnix > character.lastApiUpdateUnix ||
                    lastSeenAddonUnix > character.lastSeenAddonUnix
                ) {
                    character.init(...characterArray);
                    console.log('general', character.id, character.name);
                }
            } else {
                character = new Character();
                character.init(...characterArray);
                this.characters.push(character);
                this.characterById[characterId] = character;
            }

            character.guild ||= this.guildById[character.guildId];
            character.realm ||= wowthingData.static.realmById.get(character.realmId);
        }

        // Packed data
        const mountIds = base64ToArray(TypedArray.Uint16, userData.mountsPacked);
        for (const mountId of mountIds) {
            this.hasMountById.add(mountId);
        }

        const toyIds = base64ToArray(TypedArray.Uint16, userData.toysPacked);
        for (const toyId of toyIds) {
            this.hasToyById.add(toyId);
            const toy = wowthingData.static.toyById.get(toyId);
            if (toy) {
                this.hasToyByItemId.add(toy.itemId);
            }
        }

        for (const [speciesId, petArrays] of getNumberKeyedEntries(userData.petsRaw)) {
            this.hasPetById.add(speciesId);

            const pets = (this.petsById[speciesId] ||= []);
            if (pets.length !== petArrays.length) {
                this.petsById[speciesId] = petArrays.map(
                    (petArray) => new UserDataPet(...petArray)
                );
            } else {
                // merge to avoid complete recalc if possible
                petArrays.forEach((petArray, index) => {
                    const pet = pets[index];
                    // level, quality, breedId
                    if (
                        pet.level !== petArray[0] ||
                        pet.quality !== petArray[1] ||
                        pet.breedId !== petArray[2]
                    ) {
                        pets[index] = new UserDataPet(...petArray);
                    }
                });
            }
        }

        // Appearances
        let lastAppearanceId = 0;
        for (const diffedAppearanceId of userData.rawAppearanceIds) {
            const appearanceId = diffedAppearanceId + lastAppearanceId;
            this.hasAppearanceById.add(appearanceId);
            lastAppearanceId = appearanceId;
        }

        for (const [modifier, diffedItemIds] of getNumberKeyedEntries(
            userData.rawAppearanceSources
        )) {
            let lastItemId = 0;
            for (const diffedItemId of diffedItemIds) {
                const itemId = diffedItemId + lastItemId;
                // 123456/4 => 123456004
                this.hasAppearanceBySource.add(itemId * 1000 + modifier);
                lastItemId = itemId;
            }
        }

        // Warbank items
        if (!this._warbankScannedAt || userData.warbankScannedAt > this._warbankScannedAt) {
            this.warbankItems = userData.rawWarbankItems.map(
                (warbankItemArray) => new WarbankItem(...warbankItemArray)
            );
            this.warbankItemsByItemId = groupBy(this.warbankItems, (item) => item.itemId);
        }

        // Misc
        this.honorCurrent = userData.honorCurrent;
        this.honorLevel = userData.honorLevel;
        this.honorMax = userData.honorMax;
        this.warbankGold = userData.warbankGold;

        this.currentPeriod = Object.fromEntries(
            Object.entries(userData.currentPeriod).map(([region, cp]) => [
                region,
                Object.assign(new UserDataCurrentPeriod(), cp),
            ])
        );

        for (const [heirloomId, level] of getNumberKeyedEntries(userData.heirlooms)) {
            this.heirlooms.set(heirloomId, level);
        }

        for (const illusionId of userData.illusionIds) {
            this.hasIllusionByEnchantmentId.add(illusionId);
        }

        console.timeEnd('DataUserGeneral.process');
    }

    public anyCharacterKnowsSpellById = $derived.by(() => {
        const allKnownSpells = new Set<number>();
        for (const character of this.activeCharacters) {
            for (const knownSpellId of character.knownSpells || []) {
                allKnownSpells.add(knownSpellId);
            }
        }
        return allKnownSpells;
    });

    public hasRecipe = $derived.by(() => {
        const allAbilities = new Set<number>();
        for (const character of this.activeCharacters) {
            for (const abilityId of character.allProfessionAbilities) {
                allAbilities.add(abilityId);
            }
        }
        return allAbilities;
    });

    public characterIdsByAbilityId = $derived.by(() => {
        const ret: Record<number, number[]> = {};
        for (const character of this.activeCharacters) {
            for (const abilityId of character.allProfessionAbilities) {
                (ret[abilityId] ||= []).push(character.id);
            }
        }
        return ret;
    });

    public isKnownRecipeData: Record<number, [Faction, Set<number>]> = $derived.by(() => {
        return Object.fromEntries(
            this.activeCharacters.map((char) => [
                char.id,
                [char.faction, char.allProfessionAbilities],
            ]) as [number, [Faction, Set<number>]][]
        );
    });

    private _activeCharacters = () =>
        this.characters.filter(
            (character) =>
                sharedState.public ||
                settingsState.value.accounts?.[character.accountId]?.enabled === true
        );

    private _visibleCharacters = () =>
        this._activeCharacters().filter(
            (character) =>
                !settingsState.value.characters.hiddenCharacters.includes(character.id) &&
                !settingsState.value.characters.ignoredCharacters.includes(character.id)
        );

    private _allRegions() {
        const regionSet = new Set<number>();
        for (const account of Object.values(this.accountById)) {
            if (
                settingsState.value.accounts?.[account.id]?.enabled ||
                !settingsState.value.characters.hideDisabledAccounts
            ) {
                regionSet.add(account.region);
            }
        }

        return Array.from(regionSet);
    }

    private _charactersByConnectedRealmId() {
        return groupBy(
            this.characters.filter((character) => character.realm),
            (character) => character.realm.connectedRealmId
        );
    }

    private _charactersByRealmId() {
        return groupBy(
            this.characters.filter((character) => character.realm),
            (character) => character.realmId
        );
    }

    private lockoutData = $derived.by(() => this._lockoutData());
    private _lockoutData() {
        const allCharacterLockouts: Record<string, [Character, CharacterLockout][]> = {};
        let allLockouts: InstanceLockout[] = [];
        const allLockoutsMap: Record<string, InstanceLockout> = {};

        for (const character of this.characters) {
            for (const [key, lockout] of Object.entries(character.lockouts || {})) {
                (allCharacterLockouts[key] ||= []).push([character, lockout]);
            }
        }

        for (const [instanceDifficulty, characters] of Object.entries(allCharacterLockouts)) {
            const [instanceId, difficultyId] = instanceDifficulty
                .split('-')
                .map((s) => parseInt(s));
            const difficulty = difficultyMap[difficultyId];

            if (difficulty && instanceId) {
                // LFR is a special case because of course it is
                const lockoutKey =
                    singleLockoutRaids.has(instanceId) && ![7, 17].includes(difficulty.id)
                        ? `${instanceId}-`
                        : instanceDifficulty;

                if (!allLockoutsMap[lockoutKey]) {
                    allLockouts.push({
                        characters,
                        difficulty,
                        instanceId: instanceId,
                        key: lockoutKey,
                    });
                    allLockoutsMap[lockoutKey] = allLockouts.at(-1);
                } else {
                    allLockoutsMap[lockoutKey].characters.push(...characters);
                }
            } else {
                console.log({ instanceId, difficultyId, difficulty });
            }
        }

        allLockouts = sortBy(allLockouts, (diff) => {
            const instance = wowthingData.static.instanceById.get(diff.instanceId);
            const journalInstance = wowthingData.journal.instanceById[diff.instanceId];
            if (!diff.difficulty || !instance) {
                return 'z';
            }

            const orderIndex = 100 - (lockoutDifficultyOrderMap[diff.difficulty.id] || 99);
            return [
                leftPad(journalInstance?.order || 9999, 4, '0'),
                leftPad(orderIndex, 3, '0'),
                instance.shortName,
                diff.difficulty.shortName,
            ].join('|');
        });

        return { allLockouts, allLockoutsMap };
    }

    private _homeLockouts(): InstanceDifficulty[] {
        const { allLockoutsMap } = this.lockoutData;

        const homeLockouts: InstanceDifficulty[] = [];
        const instanceIds = uniq(settingsState.value.views.map((view) => view.homeLockouts).flat());
        for (const instanceId of instanceIds) {
            let found = false;
            for (const difficulty of lockoutDifficultyOrder) {
                const id = allLockoutsMap[`${instanceId}-${difficulty}`];
                if (id !== undefined) {
                    homeLockouts.push(id);
                    found = true;
                }
            }

            if (!found) {
                if (instanceId >= 10000000) {
                    const actualDifficulty = Math.floor(instanceId / 10000000);
                    const actualInstanceId = instanceId % 10000000;
                    homeLockouts.push({
                        difficulty: difficultyMap[actualDifficulty],
                        instanceId: actualInstanceId,
                        key: `${actualInstanceId}-${actualDifficulty}`,
                    });
                } else {
                    homeLockouts.push({
                        difficulty: null,
                        instanceId,
                        key: `${instanceId}-`,
                    });
                }
            }
        }
        return homeLockouts;
    }

    private _itemsById() {
        const ret: Record<number, [HasNameAndRealm, UserItem[]][]> = {};

        for (const character of this.activeCharacters) {
            for (const [itemId, items] of getNumberKeyedEntries(character.itemsById)) {
                (ret[itemId] ||= []).push([character, items]);
            }
        }

        for (const [itemId, items] of getNumberKeyedEntries(this.warbankItemsByItemId)) {
            (ret[itemId] ||= []).push([null, items]);
        }

        for (const guild of Object.values(this.guildById)) {
            for (const [itemId, items] of getNumberKeyedEntries(guild.itemsById)) {
                (ret[itemId] ||= []).push([guild, items]);
            }
        }

        return ret;
    }
}
