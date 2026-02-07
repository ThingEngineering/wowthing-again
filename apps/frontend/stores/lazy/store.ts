import debounce from 'lodash/debounce';
import once from 'lodash/once';
import { derived } from 'svelte/store';
import type { DateTime } from 'luxon';

import { settingsState } from '@/shared/state/settings.svelte';
import { timeStore } from '@/shared/stores/time';
import { hashObject } from '@/utils/hash-object.svelte';
import type { Settings } from '@/shared/stores/settings/types';
import type { FancyStoreType } from '@/types';
import type { UserQuestData } from '@/types/data';

import { doCharacters, type LazyCharacter } from './character';

import { AchievementsState, achievementState } from '../local-storage';

import { userQuestStore } from '../user-quests';

export const lazyStore = derived(
    [timeStore, achievementState, userQuestStore],
    debounce(
        ([$timeStore, $achievementState, $userQuestStore]: [
            DateTime,
            AchievementsState,
            FancyStoreType<UserQuestData>,
        ]) => {
            storeInstance.update(
                settingsState.value,
                $timeStore,
                $achievementState,
                $userQuestStore
            );
            return storeInstance;
        },
        100,
        {
            leading: true,
            trailing: true,
        }
    )
);

export class LazyStore {
    private settings: Settings;

    private userQuestDataId: number;

    private charactersFunc: () => Record<string, LazyCharacter>;

    private hashes: Record<string, string> = {};

    update(
        settings: Settings,
        currentTime: DateTime,
        achievementState: AchievementsState,
        userQuestData: UserQuestData
    ) {
        const newHashes: Record<string, string> = {
            currentTime: currentTime.toString(),

            achievementState: hashObject(achievementState),
            collectibleState: 'meow',
            // collectibleState: hashObject(collectibleState),

            hideUnavailable: `${settings.collections.hideUnavailable}`,
            settingsCharacterFlags: hashObject(settings.characters.flags),
            settingsCollections: hashObject(settings.collections),
            settingsTransmog: hashObject(settings.transmog),
            settingsViews: hashObject(settings.views),
        };
        const changedEntries = Object.entries(newHashes).filter(
            ([key, value]) => value !== this.hashes[key]
        );

        const changedData = {
            userQuestData: this.userQuestDataId !== userQuestStore.id,
        };

        if (
            changedEntries.length === 0 &&
            !Object.entries(changedData).some(([, value]) => value)
        ) {
            return;
        }

        // console.time('LazyStore.update')

        const changedHashes = Object.fromEntries(changedEntries);
        this.hashes = newHashes;

        this.settings = settings;

        this.userQuestDataId = userQuestStore.id;

        if (
            changedData.userQuestData ||
            changedHashes.currentTime ||
            changedHashes.settingsCharacterFlags ||
            changedHashes.settingsViews
        ) {
            this.charactersFunc = once(() =>
                doCharacters({
                    currentTime,
                    settings: this.settings,
                    userQuestData,
                })
            );
        }

        // console.timeEnd('LazyStore.update')
    }

    get characters(): Record<string, LazyCharacter> {
        return this.charactersFunc();
    }
}

const storeInstance = new LazyStore();
