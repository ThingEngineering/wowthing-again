import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import { SvelteSet } from 'svelte/reactivity';

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
    type Account,
    type CharacterLockout,
    type InstanceDifficulty,
    type InstanceLockout,
    type UserData,
} from '@/types';
import { base64ToArray } from '@/utils/base64';
import { leftPad } from '@/utils/formatting';

export class DataUserGeneral {
    public accountMap: Record<number, Account> = $state({});
    public characters: Character[] = $state([]);
    public characterById: Record<number, Character> = $state({});
    public guildMap: Record<number, Guild> = $state({});

    public hasIllusionByEnchantmentId = new SvelteSet<number>();
    public hasMountById = new SvelteSet<number>();
    public hasToyById = new SvelteSet<number>();

    public allLockouts = $derived.by(() => this._lockoutData().allLockouts);
    public allRegions = $derived.by(() => this._allRegions());
    public charactersByConnectedRealmId = $derived.by(() => this._charactersByConnectedRealmId());
    public charactersByRealmId = $derived.by(() => this._charactersByRealmId());
    public homeLockouts = $derived.by(() => this._homeLockouts());

    public process(userData: UserData): void {
        console.log(userData);
        console.time('DataUserGeneral.process');

        this.accountMap = userData.accounts;

        // Create or update Guild objects
        for (const guildArray of userData.guildsRaw) {
            const guild = new Guild();
            guild.init(...guildArray);
            this.guildMap[guild.id] = guild;
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
                    console.log('updated', character.id, character.name);
                }
            } else {
                character = new Character();
                character.init(...characterArray);
                this.characters.push(character);
                this.characterById[characterId] = character;
            }

            character.guild ||= this.guildMap[character.guildId];
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
        }

        // Misc
        for (const illusionId of userData.illusionIds) {
            this.hasIllusionByEnchantmentId.add(illusionId);
        }

        console.timeEnd('DataUserGeneral.process');
    }

    private _allRegions() {
        const regionSet = new Set<number>();
        for (const account of Object.values(this.accountMap)) {
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
                const lockoutKey = singleLockoutRaids.has(instanceId)
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
                leftPad(orderIndex, 2, '0'),
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
}
