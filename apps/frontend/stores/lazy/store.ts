import debounce from 'lodash/debounce';
import once from 'lodash/once';
import { derived, get } from 'svelte/store';
import type { DateTime } from 'luxon';

import { settingsState } from '@/shared/state/settings.svelte';
import { timeStore } from '@/shared/stores/time';
import { hashObject } from '@/utils/hash-object.svelte';
import type { Settings } from '@/shared/stores/settings/types';
import type { FancyStoreType, UserAchievementData, UserData } from '@/types';
import type { UserQuestData } from '@/types/data';

import { doAchievements, type LazyAchievements } from './achievements';
import { doAppearances, type LazyAppearances } from './appearances';
import { doCharacters, type LazyCharacter } from './character';
import { doConvertible, type LazyConvertible } from './convertible';
import { doJournal, type LazyJournal } from './journal';
import { doRecipes, LazyRecipes } from './recipes';
import { doVendors, type LazyVendors } from './vendors';
import { doZoneMaps, type LazyZoneMaps } from './zone-maps';

import {
    AchievementsState,
    achievementState,
    appearanceState,
    journalState,
    vendorState,
    zoneMapState,
    type AppearancesState,
    type JournalState,
    type VendorState,
    type ZoneMapState,
} from '../local-storage';

import { achievementStore } from '../achievements';
import { userStore } from '../user';
import { userAchievementStore } from '../user-achievements';
import { userQuestStore } from '../user-quests';

import { activeHolidays, type ActiveHolidays } from '../derived/active-holidays';

export const lazyStore = derived(
    [
        timeStore,
        achievementState,
        appearanceState,
        journalState,
        vendorState,
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
            $journalState,
            $vendorState,
            $zoneMapState,
            $userStore,
            $userAchievementStore,
            $userQuestStore,
            $activeHolidays,
        ]: [
            DateTime,
            AchievementsState,
            AppearancesState,
            JournalState,
            VendorState,
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
                $journalState,
                $vendorState,
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

    private achievementsFunc: () => LazyAchievements;
    private appearancesFunc: () => LazyAppearances;
    private charactersFunc: () => Record<string, LazyCharacter>;
    private convertibleFunc: () => LazyConvertible;
    private journalFunc: () => LazyJournal;
    private recipesFunc: () => LazyRecipes;
    private vendorsFunc: () => LazyVendors;
    private zoneMapsFunc: () => LazyZoneMaps;

    private hashes: Record<string, string> = {};

    update(
        settings: Settings,
        currentTime: DateTime,
        achievementState: AchievementsState,
        appearanceState: AppearancesState,
        journalState: JournalState,
        vendorState: VendorState,
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
            journalState: hashObject(journalState, ['filtersExpanded', 'highlightMissing']),
            vendorState: hashObject(vendorState, ['filtersExpanded']),
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
            changedData.userAchievementData ||
            changedData.userData ||
            changedData.userQuestData ||
            changedHashes.achievementState
        ) {
            this.achievementsFunc = once(() =>
                doAchievements({
                    achievementState: achievementState,
                    achievementData: get(achievementStore),
                    userAchievementData,
                    userData,
                    userQuestData,
                })
            );
        }

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

        if (
            changedData.userData ||
            changedData.userQuestData ||
            changedHashes.journalState ||
            changedHashes.settingsTransmog
        ) {
            this.journalFunc = once(() =>
                doJournal({
                    settings,
                    journalState,
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

        if (changedData.userData || changedHashes.settingsTransmog || changedHashes.vendorState) {
            this.vendorsFunc = once(() =>
                doVendors({
                    settings,
                    vendorState,
                    userData,
                    userQuestData,
                })
            );
        }

        if (
            changedData.userData ||
            changedData.userAchievementData ||
            changedData.userQuestData ||
            changedData.userAchievementData ||
            changedHashes.settingsTransmog ||
            changedHashes.zoneMapState
        ) {
            this.zoneMapsFunc = once(
                () =>
                    this.vendorsFunc() &&
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

    get achievements(): LazyAchievements {
        return this.achievementsFunc();
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
    get journal(): LazyJournal {
        return this.journalFunc();
    }
    get recipes(): LazyRecipes {
        return this.recipesFunc();
    }
    get vendors(): LazyVendors {
        return this.vendorsFunc();
    }
    get zoneMaps(): LazyZoneMaps {
        return this.zoneMapsFunc();
    }
}

const storeInstance = new LazyStore();
