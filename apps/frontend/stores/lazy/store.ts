import debounce from 'lodash/debounce';
import once from 'lodash/once';
import { derived } from 'svelte/store';
import type { DateTime } from 'luxon';

import { settingsState } from '@/shared/state/settings.svelte';
import { timeStore } from '@/shared/stores/time';
import { hashObject } from '@/utils/hash-object.svelte';
import type { Settings } from '@/shared/stores/settings/types';
import type { FancyStoreType, UserData } from '@/types';
import type { UserQuestData } from '@/types/data';

import { doCharacters, type LazyCharacter } from './character';
import { doRecipes, LazyRecipes } from './recipes';

import { AchievementsState, achievementState } from '../local-storage';

import { userStore } from '../user';
import { userAchievementStore } from '../user-achievements';
import { userQuestStore } from '../user-quests';

import { activeHolidays, type ActiveHolidays } from '../derived/active-holidays';

export const lazyStore = derived(
    [timeStore, achievementState, userStore, userQuestStore, activeHolidays],
    debounce(
        ([$timeStore, $achievementState, $userStore, $userQuestStore, $activeHolidays]: [
            DateTime,
            AchievementsState,
            FancyStoreType<UserData>,
            FancyStoreType<UserQuestData>,
            ActiveHolidays,
        ]) => {
            storeInstance.update(
                settingsState.value,
                $timeStore,
                $achievementState,
                $userStore,
                $userQuestStore,
                $activeHolidays
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

    // private userAchievementData: UserAchievementData;
    // private userData: UserData;
    // private userQuestData: UserQuestData;
    private userAchievementDataId: number;
    private userDataId: number;
    private userQuestDataId: number;

    private charactersFunc: () => Record<string, LazyCharacter>;
    private recipesFunc: () => LazyRecipes;

    private hashes: Record<string, string> = {};

    update(
        settings: Settings,
        currentTime: DateTime,
        achievementState: AchievementsState,
        userData: UserData,
        userQuestData: UserQuestData,
        activeHolidays: ActiveHolidays
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
            userData: this.userDataId !== userStore.id,
            userAchievementData: this.userAchievementDataId !== userAchievementStore.id,
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

        this.userDataId = userStore.id;
        this.userAchievementDataId = userAchievementStore.id;
        this.userQuestDataId = userQuestStore.id;

        if (
            changedData.userData ||
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
                    activeHolidays,
                })
            );
        }

        if (changedData.userData) {
            this.recipesFunc = once(() =>
                doRecipes({
                    settings,
                    userData,
                })
            );
        }

        // console.timeEnd('LazyStore.update')
    }

    get characters(): Record<string, LazyCharacter> {
        return this.charactersFunc();
    }
    get recipes(): LazyRecipes {
        return this.recipesFunc();
    }
}

const storeInstance = new LazyStore();
