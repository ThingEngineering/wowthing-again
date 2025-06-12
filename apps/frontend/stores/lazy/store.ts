import debounce from 'lodash/debounce';
import once from 'lodash/once';
import { derived } from 'svelte/store';
import type { DateTime } from 'luxon';

import { settingsState } from '@/shared/state/settings.svelte';
import { timeStore } from '@/shared/stores/time';
import { hashObject } from '@/utils/hash-object.svelte';
import type { Settings } from '@/shared/stores/settings/types';
import type { FancyStoreType, UserAchievementData, UserData } from '@/types';
import type { UserQuestData } from '@/types/data';

import { doAppearances, type LazyAppearances } from './appearances';
import { doCharacters, type LazyCharacter } from './character';
import { doConvertible, type LazyConvertible } from './convertible';
import { doRecipes, LazyRecipes } from './recipes';
import { doZoneMaps, type LazyZoneMaps } from './zone-maps';

import {
    AchievementsState,
    achievementState,
    appearanceState,
    zoneMapState,
    type AppearancesState,
    type ZoneMapState,
} from '../local-storage';

import { userStore } from '../user';
import { userAchievementStore } from '../user-achievements';
import { userQuestStore } from '../user-quests';

import { activeHolidays, type ActiveHolidays } from '../derived/active-holidays';

export const lazyStore = derived(
    [
        timeStore,
        achievementState,
        appearanceState,
        zoneMapState,
        userStore,
        userAchievementStore,
        userQuestStore,
        activeHolidays,
    ],
    debounce(
        ([
            $timeStore,
            $achievementState,
            $appearanceState,
            $zoneMapState,
            $userStore,
            $userAchievementStore,
            $userQuestStore,
            $activeHolidays,
        ]: [
            DateTime,
            AchievementsState,
            AppearancesState,
            ZoneMapState,
            FancyStoreType<UserData>,
            FancyStoreType<UserAchievementData>,
            FancyStoreType<UserQuestData>,
            ActiveHolidays,
        ]) => {
            storeInstance.update(
                settingsState.value,
                $timeStore,
                $achievementState,
                $appearanceState,
                $zoneMapState,
                $userStore,
                $userAchievementStore,
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

    private appearancesFunc: () => LazyAppearances;
    private charactersFunc: () => Record<string, LazyCharacter>;
    private convertibleFunc: () => LazyConvertible;
    private recipesFunc: () => LazyRecipes;
    private zoneMapsFunc: () => LazyZoneMaps;

    private hashes: Record<string, string> = {};

    update(
        settings: Settings,
        currentTime: DateTime,
        achievementState: AchievementsState,
        appearanceState: AppearancesState,
        zoneMapState: ZoneMapState,
        userData: UserData,
        userAchievementData: UserAchievementData,
        userQuestData: UserQuestData,
        activeHolidays: ActiveHolidays
    ) {
        const newHashes: Record<string, string> = {
            currentTime: currentTime.toString(),

            achievementState: hashObject(achievementState),
            appearanceState: hashObject(appearanceState),
            collectibleState: 'meow',
            // collectibleState: hashObject(collectibleState),
            zoneMapState: hashObject(zoneMapState),

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
            changedHashes.appearanceState ||
            changedHashes.settingsTransmog
        ) {
            this.appearancesFunc = once(() =>
                doAppearances({
                    appearanceState,
                    settings: this.settings,
                    userData,
                })
            );
        }

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
                    userData,
                    userQuestData,
                    activeHolidays,
                })
            );
        }

        if (changedData.userData || changedData.userQuestData || changedHashes.settingsTransmog) {
            this.convertibleFunc = once(() =>
                doConvertible({
                    settings: this.settings,
                    userAchievementData,
                    userData,
                    userQuestData,
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

        if (
            changedData.userData ||
            changedData.userAchievementData ||
            changedData.userQuestData ||
            changedHashes.settingsTransmog ||
            changedHashes.zoneMapState
        ) {
            this.zoneMapsFunc = once(() =>
                doZoneMaps({
                    settings,
                    zoneMapState,
                    userData,
                    userAchievementData,
                    userQuestData,
                })
            );
        }

        // console.timeEnd('LazyStore.update')
    }

    get appearances(): LazyAppearances {
        return this.appearancesFunc();
    }
    get characters(): Record<string, LazyCharacter> {
        return this.charactersFunc();
    }
    get convertible(): LazyConvertible {
        return this.convertibleFunc();
    }
    get recipes(): LazyRecipes {
        return this.recipesFunc();
    }
    get zoneMaps(): LazyZoneMaps {
        return this.zoneMapsFunc();
    }
}

const storeInstance = new LazyStore();
