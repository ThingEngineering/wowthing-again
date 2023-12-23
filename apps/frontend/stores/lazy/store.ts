import debounce from 'lodash/debounce'
import find from 'lodash/find'
import once from 'lodash/once'
import some from 'lodash/some'
import { derived, get } from 'svelte/store'
import type { DateTime } from 'luxon'

import { doCharacters, type LazyCharacter } from './character'
import { doCollectible, type LazyCollectible } from './collectible'
import { doConvertible, type LazyConvertible } from './convertible'
import { doJournal, type LazyJournal } from './journal'
import { doTransmog, type LazyTransmog } from './transmog'
import { doVendors, type LazyVendors } from './vendors'
import { doZoneMaps, type LazyZoneMaps } from './zone-maps'

import {
    appearanceState,
    collectibleState,
    journalState,
    vendorState,
    zoneMapState,
    type CollectibleState,
    type AppearancesState,
    type JournalState,
    type VendorState,
    type ZoneMapState
} from '../local-storage'

import { appearanceStore } from '../appearance'
import { itemStore } from '../item'
import { journalStore } from '../journal'
import { manualStore } from '../manual'
import { settingsStore } from '@/shared/stores/settings'
import { staticStore } from '@/shared/stores/static'
import { timeStore } from '../time'
import { userStore } from '../user'
import { userAchievementStore } from '../user-achievements'
import { userQuestStore } from '../user-quests'
import { userTransmogStore } from '../user-transmog'

import { UserCount } from '@/types'

import { hashObject } from '@/utils/hash-object'
import type { StaticData } from '@/shared/stores/static/types'
import type { FancyStoreType, UserAchievementData, UserData } from '@/types'
import type { JournalData, UserQuestData, UserTransmogData } from '@/types/data'
import type { AppearanceData } from '@/types/data/appearance'
import type {
    ManualData,
    ManualDataHeirloomItem,
    ManualDataIllusionItem,
} from '@/types/data/manual'
import type { ItemData } from '@/types/data/item'
import type { Settings } from '@/shared/stores/settings/types'


type LazyKey =
    | 'appearances'
    | 'heirlooms'
    | 'illusions'
    | 'mounts'
    | 'pets'
    | 'toys'

type LazyUgh = {
    [k in LazyKey]: LazyCollectible|UserCounts
}

type GenericCategory<T> = {
    name: string
    items: T[]
}

type DoGenericParameters<T, U> = {
    categories: T[]
    haveFunc: (item: U) => boolean
    includeUnavailable: boolean
    haveCountFunc?: (item: U) => number
    totalCountFunc?: (item: U) => number
}

type UserCounts = Record<string, UserCount>

export const lazyStore = derived(
    [
        settingsStore,
        timeStore,
        appearanceState,
        collectibleState,
        journalState,
        vendorState,
        zoneMapState,
        userStore,
        userAchievementStore,
        userQuestStore,
        userTransmogStore
    ],
    debounce(
        ([
            $settingsStore,
            $timeStore,
            $appearanceState,
            $collectibleState,
            $journalState,
            $vendorState,
            $zoneMapState,
            $userStore,
            $userAchievementStore,
            $userQuestStore,
            $userTransmogStore
        ]: [
            Settings,
            DateTime,
            AppearancesState,
            CollectibleState,
            JournalState,
            VendorState,
            ZoneMapState,
            FancyStoreType<UserData>,
            FancyStoreType<UserAchievementData>,
            FancyStoreType<UserQuestData>,
            FancyStoreType<UserTransmogData>
        ]) => {
            storeInstance.update(
                $settingsStore,
                $timeStore,
                $appearanceState,
                $collectibleState,
                $journalState,
                $vendorState,
                $zoneMapState,
                $userStore,
                $userAchievementStore,
                $userQuestStore,
                $userTransmogStore
            )
            return storeInstance
        },
        100,
        {
            leading: true,
            trailing: true,
        }
    )
)

export class LazyStore implements LazyUgh {
    private settings: Settings

    private appearanceState: AppearancesState
    private collectibleState: CollectibleState
    private journalState: JournalState
    private zoneMapState: ZoneMapState
    
    private appearanceData: AppearanceData
    private itemData: ItemData
    private journalData: JournalData
    private manualData: ManualData
    private staticData: StaticData

    private userAchievementData: UserAchievementData
    private userData: UserData
    private userQuestData: UserQuestData
    private userTransmogData: UserTransmogData
    
    private appearancesFunc: () => UserCounts
    private customizationsFunc: () => UserCounts
    private heirloomsFunc: () => UserCounts
    private illusionsFunc: () => UserCounts

    private charactersFunc: () => Record<string, LazyCharacter>
    private convertibleFunc: () => LazyConvertible
    private journalFunc: () => LazyJournal
    private mountsFunc: () => LazyCollectible
    private petsFunc: () => LazyCollectible
    private toysFunc: () => LazyCollectible
    private transmogFunc: () => LazyTransmog
    private vendorsFunc: () => LazyVendors
    private zoneMapsFunc: () => LazyZoneMaps

    private hashes: Record<string, string> = {}

    update(
        settings: Settings,
        currentTime: DateTime,
        appearanceState: AppearancesState,
        collectibleState: CollectibleState,
        journalState: JournalState,
        vendorState: VendorState,
        zoneMapState: ZoneMapState,
        userData: UserData,
        userAchievementData: UserAchievementData,
        userQuestData: UserQuestData,
        userTransmogData: UserTransmogData
    )
    {
        const newHashes: Record<string, string> = {
            currentTime: currentTime.toString(),

            appearanceState: hashObject(appearanceState), 
            collectibleState: hashObject(collectibleState),
            journalState: hashObject(journalState, ['filtersExpanded', 'highlightMissing']),
            vendorState: hashObject(vendorState, ['filtersExpanded']),
            zoneMapState: hashObject(zoneMapState),
            
            hideUnavailable: `${settings.collections.hideUnavailable}`,
            settingsCharacterFlags: hashObject(settings.characters.flags),
            settingsCollections: hashObject(settings.collections),
            settingsTasks: hashObject(settings.tasks),
            settingsTransmog: hashObject(settings.transmog),
            settingsViews: hashObject(settings.views),
        }
        const changedEntries = Object.entries(newHashes)
            .filter(([key, value]) => value !== this.hashes[key])

        const changedData = {
            userData: this.userData !== userData,
            userAchievementData: this.userAchievementData !== userAchievementData,
            userQuestData: this.userQuestData !== userQuestData,
            userTransmogData: this.userTransmogData !== userTransmogData
        }

        if (
            changedEntries.length === 0 &&
            !some(
                Object.entries(changedData),
                ([, value]) => value
            )
        ) {
            return
        }

        // console.time('LazyStore.update')

        const changedHashes = Object.fromEntries(changedEntries)
        this.hashes = newHashes

        /*const appearanceData =*/ this.appearanceData = get(appearanceStore)
        const itemData = this.itemData = get(itemStore)
        const journalData = this.journalData = get(journalStore)
        const manualData = this.manualData = get(manualStore)
        const staticData = this.staticData = get(staticStore)

        this.settings = settings

        this.appearanceState = appearanceState
        this.collectibleState = collectibleState
        this.journalState = journalState
        this.zoneMapState = zoneMapState

        this.userData = userData
        this.userAchievementData = userAchievementData
        this.userQuestData = userQuestData
        this.userTransmogData = userTransmogData

        if (changedData.userData ||
            changedData.userQuestData ||
            changedHashes.currentTime ||
            changedHashes.settingsCharacterFlags ||
            changedHashes.settingsTasks ||
            changedHashes.settingsViews)
        {
            this.charactersFunc = once(() => doCharacters({
                currentTime,
                settings: this.settings,
                userData: this.userData,
                userQuestData: this.userQuestData
            }))
        }

        if (changedData.userData ||
            changedData.userQuestData ||
            changedData.userTransmogData ||
            changedHashes.settings)
        {
            this.convertibleFunc = once(() => doConvertible({
                itemData: this.itemData,
                settings: this.settings,
                userData: this.userData,
                userQuestData: this.userQuestData,
                userTransmogData: this.userTransmogData,
            }))
        }

        if (changedData.userData ||
            changedHashes.collectibleState ||
            changedHashes.hideUnavailable)
        {
            const collectibleStores = {
                collectibleState,
                settings,
            }

            this.mountsFunc = once(() => doCollectible(
                collectibleStores,
                'mounts',
                this.manualData.mountSets,
                this.userData.hasMount
            ))
            this.petsFunc = once(() => doCollectible(
                collectibleStores,
                'pets',
                this.manualData.petSets,
                this.userData.hasPet
            ))
            this.toysFunc = once(() => doCollectible(
                collectibleStores,
                'toys',
                this.manualData.toySets,
                this.userData.hasToy
            ))
        }

        if (changedData.userTransmogData ||
            changedHashes.appearanceState ||
            changedHashes.settingsTransmog)
        {
            this.appearancesFunc = once(() => this.doAppearances())
        }

        if (changedData.userQuestData) {
            this.customizationsFunc = once(() => this.doCustomizations())
        }

        if (changedData.userData ||
            changedHashes.settingsCollections) {
            this.heirloomsFunc = once(() => this.doHeirlooms())
        }

        if (changedData.userTransmogData ||
            changedHashes.settingsCollections) {
            this.illusionsFunc = once(() => this.doIllusions())
        }

        if (changedData.userData ||
            changedData.userTransmogData ||
            changedHashes.journalState ||
            changedHashes.settingsTransmog)
        {
            this.journalFunc = once(() => doJournal({
                settings,
                itemData,
                journalState,
                journalData,
                staticData,
                userData,
                userTransmogData,
            }))
        }

        if (changedData.userData ||
            changedData.userTransmogData ||
            changedHashes.settingsTransmog) {
            this.transmogFunc = once(() => doTransmog({
                settings,
                itemData,
                manualData,
                staticData,
                userTransmogData,
            }))
        }

        if (changedData.userData ||
            changedData.userTransmogData ||
            changedHashes.settingsTransmog ||
            changedHashes.vendorState)
        {
            this.vendorsFunc = once(() => doVendors({
                settings,
                vendorState,
                itemData,
                manualData,
                staticData,
                userData,
                userQuestData,
                userTransmogData,
            }))
        }

        if (changedData.userData ||
            changedData.userAchievementData ||
            changedData.userQuestData ||
            changedData.userAchievementData ||
            changedHashes.zoneMapState)
        {
            this.zoneMapsFunc = once(() => this.vendorsFunc() && doZoneMaps({
                settings,
                zoneMapState,
                itemData,
                manualData,
                staticData,
                userData,
                userAchievementData,
                userQuestData,
                userTransmogData,
            }))
        }

        // console.timeEnd('LazyStore.update')
    }

    lookup(key: string): LazyCollectible|UserCounts {
        return this[key as LazyKey]
    }

    get appearances(): UserCounts { return this.appearancesFunc() }
    get characters(): Record<string, LazyCharacter> { return this.charactersFunc() }
    get convertible(): LazyConvertible { return this.convertibleFunc() }
    get customizations(): UserCounts { return this.customizationsFunc() }
    get heirlooms(): UserCounts { return this.heirloomsFunc() }
    get illusions(): UserCounts { return this.illusionsFunc() }
    get journal(): LazyJournal { return this.journalFunc() }
    get mounts(): LazyCollectible { return this.mountsFunc() }
    get pets(): LazyCollectible { return this.petsFunc() }
    get toys(): LazyCollectible { return this.toysFunc() }
    get transmog(): LazyTransmog { return this.transmogFunc() }
    get vendors(): LazyVendors { return this.vendorsFunc() }
    get zoneMaps(): LazyZoneMaps { return this.zoneMapsFunc() }

    private doGeneric<T extends GenericCategory<U>, U>(params: DoGenericParameters<T, U>): UserCounts {
        const counts: UserCounts = {}
        const overallData = counts['OVERALL'] = new UserCount()

        for (const category of params.categories) {
            const categoryUnavailable = category.name.startsWith('Unavailable')
            const availabilityData = counts[categoryUnavailable ? 'UNAVAILABLE' : 'AVAILABLE'] ||= new UserCount()
            const categoryData = counts[category.name] = new UserCount()

            for (const item of category.items) {
                const userHas = params.haveFunc(item)

                if (categoryUnavailable && params.includeUnavailable !== true && !userHas) {
                    continue
                }
                
                const totalCount = params.totalCountFunc?.(item) || 1
                overallData.total += totalCount
                availabilityData.total += totalCount
                categoryData.total += totalCount

                if (userHas) {
                    const haveCount = params.haveCountFunc?.(item) || 1
                    overallData.have += haveCount
                    availabilityData.have += haveCount
                    categoryData.have += haveCount
                }
            }
        }

        return counts
    }

    private doAppearances(): UserCounts {
        const counts: UserCounts = {}
        const overallData = counts['OVERALL'] = new UserCount()
        const overallSeen: Record<number, boolean> = {}

        for (const [key, sets] of Object.entries(this.appearanceData.appearances)) {
            const parentData = counts[key.split('--')[0]] ||= new UserCount()
            const catData = counts[key] = new UserCount()

            for (const set of sets) {
                const setData = counts[`${key}--${set.name}`] = new UserCount()

                for (const appearance of set.appearances) {
                    const quality = appearance.modifiedAppearances[0]?.quality
                    if (this.appearanceState[`showQuality${quality}`] === false) {
                        continue
                    }

                    if (!overallSeen[appearance.appearanceId]) {
                        overallData.total++
                    }

                    parentData.total++
                    catData.total++
                    setData.total++
                    
                    if (this.userTransmogData.hasAppearance.has(appearance.appearanceId)) {
                        if (!overallSeen[appearance.appearanceId]) {
                            overallData.have++
                        }

                        parentData.have++
                        catData.have++
                        setData.have++
                    }

                    overallSeen[appearance.appearanceId] = true
                }
            }
        }

        return counts
    }

    private doCustomizations(): UserCounts {
        const counts: UserCounts = {}
        const overallData = counts['OVERALL'] = new UserCount()

        for (const categories of this.manualData.customizationCategories) {
            const sectionData = counts[categories[0].slug] = new UserCount()

            for (const category of categories.slice(1)) {
                const categoryKey = `${categories[0].slug}--${category.slug}`
                const categoryData = counts[categoryKey] = new UserCount()

                for (const group of category.groups) {
                    const groupKey = `${categoryKey}--${group.name}`
                    const groupData = counts[groupKey] = new UserCount()

                    for (const { questId } of group.things) {
                        overallData.total++
                        sectionData.total++
                        categoryData.total++
                        groupData.total++

                        if (this.userQuestData.accountHas.has(questId)) {
                            overallData.have++
                            sectionData.have++
                            categoryData.have++
                            groupData.have++
                        }
                    }
                }
            }
        }

        return counts
    }

    private doHeirlooms(): UserCounts {
        return this.doGeneric({
            categories: this.manualData.heirlooms,
            includeUnavailable: !this.settings.collections.hideUnavailable,
            haveFunc: (heirloom: ManualDataHeirloomItem) => this.userData.heirlooms?.[
                this.staticData.heirloomsByItemId[heirloom.itemId].id] !== undefined,
            totalCountFunc: (heirloom: ManualDataHeirloomItem) => this.staticData.heirloomsByItemId[heirloom.itemId].upgradeBonusIds.length + 1,
            haveCountFunc: (heirloom: ManualDataHeirloomItem) => {
                const staticHeirloom = this.staticData.heirloomsByItemId[heirloom.itemId]
                const userCount = this.userData.heirlooms?.[staticHeirloom.id]
                return userCount !== undefined ? userCount + 1 : 0
            },
        })
    }

    private doIllusions(): UserCounts {
        return this.doGeneric({
            categories: this.manualData.illusions,
            includeUnavailable: !this.settings.collections.hideUnavailable,
            haveFunc: (illusion: ManualDataIllusionItem) => this.userTransmogData.hasIllusion.has(
                find(
                    this.staticData.illusions,
                    (staticIllusion) => staticIllusion.enchantmentId === illusion.enchantmentId
                )?.enchantmentId
            ),
        })
    }
}

const storeInstance = new LazyStore()
