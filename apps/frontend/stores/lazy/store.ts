import debounce from 'lodash/debounce';
import find from 'lodash/find';
import once from 'lodash/once';
import { derived, get } from 'svelte/store';
import type { DateTime } from 'luxon';

import { doAchievements, type LazyAchievements } from './achievements';
import { doAppearances, type LazyAppearances } from './appearances';
import { doCharacters, type LazyCharacter } from './character';
import { doCollectible, type LazyCollectible } from './collectible';
import { doConvertible, type LazyConvertible } from './convertible';
import { doJournal, type LazyJournal } from './journal';
import { doRecipes, LazyRecipes } from './recipes';
import { doTransmog, type LazyTransmog } from './transmog';
import { doVendors, type LazyVendors } from './vendors';
import { doZoneMaps, type LazyZoneMaps } from './zone-maps';

import {
    AchievementsState,
    achievementState,
    appearanceState,
    collectibleState,
    journalState,
    vendorState,
    zoneMapState,
    type AppearancesState,
    type CollectibleState,
    type JournalState,
    type VendorState,
    type ZoneMapState,
} from '../local-storage';

import { achievementStore } from '../achievements';
import { itemStore } from '../item';
import { journalStore } from '../journal';
import { settingsState } from '@/shared/state/settings.svelte';
import { staticStore } from '@/shared/stores/static';
import { timeStore } from '@/shared/stores/time';
import { userStore } from '../user';
import { userAchievementStore } from '../user-achievements';
import { userQuestStore } from '../user-quests';

import { UserCount } from '@/types';
import { hashObject } from '@/utils/hash-object.svelte';

import type { Settings } from '@/shared/stores/settings/types';
import type { StaticData } from '@/shared/stores/static/types';
import type { FancyStoreType, UserAchievementData, UserData } from '@/types';
import type { JournalData, UserQuestData } from '@/types/data';
import type { ManualDataHeirloomItem, ManualDataIllusionItem } from '@/types/data/manual';
import type { ItemData } from '@/types/data/item';
import { activeHolidays, type ActiveHolidays } from '../derived/active-holidays';
import { wowthingData } from '@/shared/stores/data';
import type { DataManual } from '@/shared/stores/data/manual/types';

type LazyKey = 'heirlooms' | 'illusions' | 'mounts' | 'pets' | 'toys';

type LazyUgh = {
    [k in LazyKey]: LazyCollectible | UserCounts;
};

type GenericCategory<T> = {
    name: string;
    items: T[];
};

type DoGenericParameters<T, U> = {
    categories: T[];
    haveFunc: (item: U) => boolean;
    includeUnavailable: boolean;
    haveCountFunc?: (item: U) => number;
    totalCountFunc?: (item: U) => number;
};

type UserCounts = Record<string, UserCount>;

export const lazyStore = derived(
    [
        timeStore,
        achievementState,
        appearanceState,
        collectibleState,
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
            $collectibleState,
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
            CollectibleState,
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
                $collectibleState,
                $journalState,
                $vendorState,
                $zoneMapState,
                $userStore,
                $userAchievementStore,
                $userQuestStore,
                $activeHolidays,
            );
            return storeInstance;
        },
        100,
        {
            leading: true,
            trailing: true,
        },
    ),
);

export class LazyStore implements LazyUgh {
    private settings: Settings;

    private itemData: ItemData;
    private journalData: JournalData;
    private staticData: StaticData;

    // private userAchievementData: UserAchievementData;
    // private userData: UserData;
    // private userQuestData: UserQuestData;
    private userAchievementDataId: number;
    private userDataId: number;
    private userQuestDataId: number;

    private customizationsFunc: () => UserCounts;
    private heirloomsFunc: () => UserCounts;
    private illusionsFunc: () => UserCounts;

    private achievementsFunc: () => LazyAchievements;
    private appearancesFunc: () => LazyAppearances;
    private charactersFunc: () => Record<string, LazyCharacter>;
    private convertibleFunc: () => LazyConvertible;
    private journalFunc: () => LazyJournal;
    private mountsFunc: () => LazyCollectible;
    private petsFunc: () => LazyCollectible;
    private recipesFunc: () => LazyRecipes;
    private toysFunc: () => LazyCollectible;
    private transmogFunc: () => LazyTransmog;
    private vendorsFunc: () => LazyVendors;
    private zoneMapsFunc: () => LazyZoneMaps;

    private hashes: Record<string, string> = {};

    update(
        settings: Settings,
        currentTime: DateTime,
        achievementState: AchievementsState,
        appearanceState: AppearancesState,
        collectibleState: CollectibleState,
        journalState: JournalState,
        vendorState: VendorState,
        zoneMapState: ZoneMapState,
        userData: UserData,
        userAchievementData: UserAchievementData,
        userQuestData: UserQuestData,
        activeHolidays: ActiveHolidays,
    ) {
        const newHashes: Record<string, string> = {
            currentTime: currentTime.toString(),

            achievementState: hashObject(achievementState),
            appearanceState: hashObject(appearanceState),
            collectibleState: hashObject(collectibleState),
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
            ([key, value]) => value !== this.hashes[key],
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

        const itemData = (this.itemData = get(itemStore));
        const journalData = (this.journalData = get(journalStore));
        const staticData = (this.staticData = get(staticStore));

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
                }),
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
                    itemData: this.itemData,
                    staticData: this.staticData,
                    userData,
                }),
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
                    staticData: this.staticData,
                    userData,
                    userQuestData,
                    activeHolidays,
                }),
            );
        }

        if (changedData.userData || changedData.userQuestData || changedHashes.settingsTransmog) {
            this.convertibleFunc = once(() =>
                doConvertible({
                    itemData: this.itemData,
                    settings: this.settings,
                    userAchievementData,
                    userData,
                    userQuestData,
                }),
            );
        }

        if (
            changedData.userData ||
            changedHashes.collectibleState ||
            changedHashes.hideUnavailable
        ) {
            const collectibleStores = {
                collectibleState,
                settings,
            };

            this.mountsFunc = once(() =>
                doCollectible(
                    collectibleStores,
                    'mounts',
                    wowthingData.manual.mountSets,
                    userData.hasMount,
                ),
            );
            this.petsFunc = once(() =>
                doCollectible(
                    collectibleStores,
                    'pets',
                    wowthingData.manual.petSets,
                    userData.hasPet,
                ),
            );
            this.toysFunc = once(() =>
                doCollectible(
                    collectibleStores,
                    'toys',
                    wowthingData.manual.toySets,
                    userData.hasToy,
                ),
            );
        }

        if (changedData.userQuestData) {
            this.customizationsFunc = once(() =>
                this.doCustomizations(userAchievementData, userData, userQuestData),
            );
        }

        if (changedData.userData || changedHashes.settingsCollections) {
            this.heirloomsFunc = once(() => this.doHeirlooms(userData));
        }

        if (changedData.userData || changedHashes.settingsCollections) {
            this.illusionsFunc = once(() => this.doIllusions(userData));
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
                    itemData,
                    journalState,
                    journalData,
                    staticData,
                    userData,
                    userQuestData,
                }),
            );
        }

        if (changedData.userData) {
            this.recipesFunc = once(() =>
                doRecipes({
                    settings,
                    staticData,
                    userData,
                }),
            );
        }

        if (changedData.userData || changedHashes.settingsTransmog) {
            this.transmogFunc = once(() =>
                doTransmog({
                    settings,
                    itemData,
                    staticData,
                    userAchievementData,
                    userData,
                    userQuestData,
                }),
            );
        }

        if (changedData.userData || changedHashes.settingsTransmog || changedHashes.vendorState) {
            this.vendorsFunc = once(() =>
                doVendors({
                    settings,
                    vendorState,
                    itemData,
                    staticData,
                    userData,
                    userQuestData,
                    lazyTransmog: this.transmogFunc(),
                }),
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
                        itemData,
                        staticData,
                        userData,
                        userAchievementData,
                        userQuestData,
                        lazyTransmog: this.transmogFunc(),
                    }),
            );
        }

        // console.timeEnd('LazyStore.update')
    }

    lookup(key: string): LazyCollectible | UserCounts {
        return this[key as LazyKey];
    }

    get customizations(): UserCounts {
        return this.customizationsFunc();
    }
    get heirlooms(): UserCounts {
        return this.heirloomsFunc();
    }
    get illusions(): UserCounts {
        return this.illusionsFunc();
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
    get mounts(): LazyCollectible {
        return this.mountsFunc();
    }
    get pets(): LazyCollectible {
        return this.petsFunc();
    }
    get recipes(): LazyRecipes {
        return this.recipesFunc();
    }
    get toys(): LazyCollectible {
        return this.toysFunc();
    }
    get transmog(): LazyTransmog {
        return this.transmogFunc();
    }
    get vendors(): LazyVendors {
        return this.vendorsFunc();
    }
    get zoneMaps(): LazyZoneMaps {
        return this.zoneMapsFunc();
    }

    private doGeneric<T extends GenericCategory<U>, U>(
        params: DoGenericParameters<T, U>,
    ): UserCounts {
        const counts: UserCounts = {};
        const overallData = (counts['OVERALL'] = new UserCount());

        for (const category of params.categories) {
            const categoryUnavailable = category.name.startsWith('Unavailable');
            const availabilityData = (counts[categoryUnavailable ? 'UNAVAILABLE' : 'AVAILABLE'] ||=
                new UserCount());
            const categoryData = (counts[category.name] = new UserCount());

            for (const item of category.items) {
                const userHas = params.haveFunc(item);

                if (categoryUnavailable && params.includeUnavailable !== true && !userHas) {
                    continue;
                }

                const totalCount = params.totalCountFunc?.(item) || 1;
                overallData.total += totalCount;
                availabilityData.total += totalCount;
                categoryData.total += totalCount;

                if (userHas) {
                    const haveCount = params.haveCountFunc?.(item) || 1;
                    overallData.have += haveCount;
                    availabilityData.have += haveCount;
                    categoryData.have += haveCount;
                }
            }
        }

        return counts;
    }

    private doCustomizations(
        userAchievementData: UserAchievementData,
        userData: UserData,
        userQuestData: UserQuestData,
    ): UserCounts {
        const counts: UserCounts = {};
        const overallData = (counts['OVERALL'] = new UserCount());

        for (const categories of wowthingData.manual.customizationCategories) {
            const sectionData = (counts[categories[0].slug] = new UserCount());

            for (const category of categories.slice(1)) {
                const categoryKey = `${categories[0].slug}--${category.slug}`;
                const categoryData = (counts[categoryKey] = new UserCount());

                for (const group of category.groups) {
                    const groupKey = `${categoryKey}--${group.name}`;
                    const groupData = (counts[groupKey] = new UserCount());

                    for (const thing of group.things) {
                        overallData.total++;
                        sectionData.total++;
                        categoryData.total++;
                        groupData.total++;

                        if (
                            (thing.achievementId > 0 &&
                                !!userAchievementData.achievements[thing.achievementId]) ||
                            (thing.questId > 0 && userQuestData.accountHas.has(thing.questId)) ||
                            (thing.spellId > 0 &&
                                userData.characters.some((char) =>
                                    char.knownSpells?.includes(thing.spellId),
                                )) ||
                            (thing.appearanceModifier >= 0 &&
                                userData.hasSourceV2
                                    .get(thing.appearanceModifier)
                                    .has(thing.itemId))
                        ) {
                            overallData.have++;
                            sectionData.have++;
                            categoryData.have++;
                            groupData.have++;
                        }
                    }
                }
            }
        }

        return counts;
    }

    private doHeirlooms(userData: UserData): UserCounts {
        return this.doGeneric({
            categories: wowthingData.manual.heirlooms,
            includeUnavailable: !this.settings.collections.hideUnavailable,
            haveFunc: (heirloom: ManualDataHeirloomItem) =>
                userData.heirlooms?.[this.staticData.heirloomsByItemId[heirloom.itemId].id] !==
                undefined,
            totalCountFunc: (heirloom: ManualDataHeirloomItem) =>
                this.staticData.heirloomsByItemId[heirloom.itemId].upgradeBonusIds.length + 1,
            haveCountFunc: (heirloom: ManualDataHeirloomItem) => {
                const staticHeirloom = this.staticData.heirloomsByItemId[heirloom.itemId];
                const userCount = userData.heirlooms?.[staticHeirloom.id];
                return userCount !== undefined ? userCount + 1 : 0;
            },
        });
    }

    private doIllusions(userData: UserData): UserCounts {
        return this.doGeneric({
            categories: wowthingData.manual.illusions,
            includeUnavailable: !this.settings.collections.hideUnavailable,
            haveFunc: (illusion: ManualDataIllusionItem) =>
                userData.hasIllusion.has(
                    find(
                        this.staticData.illusions,
                        (staticIllusion) => staticIllusion.enchantmentId === illusion.enchantmentId,
                    )?.enchantmentId,
                ),
        });
    }
}

const storeInstance = new LazyStore();
