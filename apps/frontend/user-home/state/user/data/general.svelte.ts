import uniq from 'lodash/uniq';
import { get } from 'svelte/store';

import { staticStore } from '@/shared/stores/static';
import {
    Character,
    Guild,
    type Account,
    type CharacterLockout,
    type InstanceDifficulty,
    type InstanceLockout,
    type UserData,
} from '@/types';
import type { Region } from '@/enums/region';
import { settingsState } from '@/shared/state/settings.svelte';
import {
    difficultyMap,
    lockoutDifficultyOrder,
    lockoutDifficultyOrderMap,
} from '@/data/difficulty';
import { singleLockoutRaids } from '@/data/raid';
import sortBy from 'lodash/sortBy';
import { journalStore } from '@/stores';
import { leftPad } from '@/utils/formatting';

export class DataUserGeneral {
    public accountMap: Record<number, Account> = $state({});
    public characters: Character[] = $state([]);
    public characterMap: Record<number, Character> = $state({});
    public guildMap: Record<number, Guild> = $state({});
    public regions: Region[] = $state([]);

    public allLockouts = $derived.by(() => this._lockoutData().allLockouts);
    public homeLockouts: InstanceDifficulty[] = $derived.by(() => this._homeLockouts());

    public process(userData: UserData): void {
        console.log(userData);
        console.time('DataUserGeneral.process');

        const staticData = get(staticStore);

        // Create or update Guild objects
        for (const guildArray of userData.guildsRaw) {
            const guild = new Guild();
            guild.init(...guildArray);
            this.guildMap[guild.id] = guild;
        }

        // Create or update Character objects
        for (const characterArray of userData.charactersRaw) {
            const characterId = characterArray[0];
            let character = this.characterMap[characterId];
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
                this.characterMap[characterId] = character;
            }

            character.realm ||= staticData.realms[character.realmId];
        }

        const regions = uniq(
            this.characters.map((char) => char.realm?.region).filter((region) => !!region)
        );
        regions.sort();
        this.regions = regions;

        console.timeEnd('DataUserGeneral.process');
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

        const journalData = get(journalStore);
        const staticData = get(staticStore);
        allLockouts = sortBy(allLockouts, (diff) => {
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
