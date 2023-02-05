import debounce from 'lodash/debounce'
import find from 'lodash/find'
import once from 'lodash/once'
import some from 'lodash/some'
import { derived, get } from 'svelte/store'

import { doJournal, type LazyJournal } from './journal'
import { doTransmog, type LazyTransmog } from './transmog'
import { doZoneMaps, type LazyZoneMaps } from './zone-maps'

import { AppearancesState, appearanceState, JournalState, journalState, zoneMapState, ZoneMapState } from '../local-storage'
import { appearanceStore } from '../appearance'
import { itemStore } from '../item'
import { journalStore } from '../journal'
import { manualStore } from '../manual'
import { settingsStore } from '../settings'
import { staticStore } from '../static'
import { userStore } from '../user'
import { userAchievementStore } from '../user-achievements'
import { userQuestStore } from '../user-quests'
import { userTransmogStore } from '../user-transmog'

import { UserCount, type UserAchievementData } from '@/types'
import type { UserQuestData } from '@/types/data'

import type { FancyStoreType, Settings, UserData} from '@/types'
import type { JournalData, UserTransmogData } from '@/types/data'
import type { AppearanceData } from '@/types/data/appearance'
import type {
    ManualData,
    ManualDataHeirloomItem,
    ManualDataIllusionItem,
    ManualDataSetCategory
} from '@/types/data/manual'
import type { ItemData } from '@/types/data/item'
import type { StaticData } from '@/types/data/static'


type LazyKey =
    | 'appearances'
    | 'heirlooms'
    | 'illusions'
    | 'mounts'
    | 'pets'
    | 'toys'

type LazyUgh = {
    [k in LazyKey]: UserCounts
}

type GenericCategory<T> = {
    name: string
    items: T[]
}

type UserCounts = Record<string, UserCount>

export const lazyStore = derived(
    [
        settingsStore,
        appearanceState,
        journalState,
        zoneMapState,
        userStore,
        userAchievementStore,
        userQuestStore,
        userTransmogStore
    ],
    debounce(
        ([
            $settingsStore,
            $appearanceState,
            $journalState,
            $zoneMapState,
            $userStore,
            $userAchievementStore,
            $userQuestStore,
            $userTransmogStore
        ]: [
            Settings,
            AppearancesState,
            JournalState,
            ZoneMapState,
            FancyStoreType<UserData>,
            FancyStoreType<UserAchievementData>,
            FancyStoreType<UserQuestData>,
            FancyStoreType<UserTransmogData>
        ]) => {
            storeInstance.update(
                $settingsStore,
                $appearanceState,
                $journalState,
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

class LazyStore implements LazyUgh {
    private settings: Settings

    private appearanceState: AppearancesState
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
    private dragonridingFunc: () => UserCounts
    private heirloomsFunc: () => UserCounts
    private illusionsFunc: () => UserCounts
    private mountsFunc: () => UserCounts
    private petsFunc: () => UserCounts
    private toysFunc: () => UserCounts

    private journalFunc: () => LazyJournal
    private transmogFunc: () => LazyTransmog
    private zoneMapsFunc: () => LazyZoneMaps

    private hashes: Record<string, string> = {}

    update(
        settings: Settings,
        appearanceState: AppearancesState,
        journalState: JournalState,
        zoneMapState: ZoneMapState,
        userData: UserData,
        userAchievementData: UserAchievementData,
        userQuestData: UserQuestData,
        userTransmogData: UserTransmogData
    )
    {
        const newHashes: Record<string, string> = {
            appearanceState: this.hashObject(appearanceState), 
            journalState: this.hashObject(journalState),
            zoneMapState: this.hashObject(zoneMapState),
            
            collections: `${settings.collections.hideUnavailable}`,
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

        console.time('LazyStore.update')

        const changedHashes = Object.fromEntries(changedEntries)
        this.hashes = newHashes

        const appearanceData = this.appearanceData = get(appearanceStore)
        const itemData = this.itemData = get(itemStore)
        const journalData = this.journalData = get(journalStore)
        const manualData = this.manualData = get(manualStore)
        const staticData = this.staticData = get(staticStore)

        this.settings = settings

        this.appearanceState = appearanceState
        this.journalState = journalState
        this.zoneMapState = zoneMapState

        this.userData = userData
        this.userAchievementData = userAchievementData
        this.userQuestData = userQuestData
        this.userTransmogData = userTransmogData

        if (changedData.userData || changedHashes.collections) {
            this.mountsFunc = once(() => this.doSetCounts(this.manualData.mountSets, this.userData.hasMount))
            this.petsFunc = once(() => this.doSetCounts(this.manualData.petSets, this.userData.hasPet))
            this.toysFunc = once(() => this.doSetCounts(this.manualData.toySets, this.userData.hasToy))
        }

        if (changedData.userTransmogData || changedHashes.appearanceState) {
            this.appearancesFunc = once(() => this.doAppearances())
        }

        if (changedData.userQuestData) {
            this.dragonridingFunc = once(() => this.doDragonriding())
        }

        if (changedData.userData) {
            this.heirloomsFunc = once(() => this.doHeirlooms())
        }

        if (changedData.userTransmogData) {
            this.illusionsFunc = once(() => this.doIllusions())
        }

        if (changedData.userData || changedData.userTransmogData || changedHashes.journalState)
        {
            this.journalFunc = once(() => doJournal({
                settings,
                journalState,
                journalData,
                staticData,
                userData,
                userTransmogData,
            }))
        }

        if (changedData.userData) {
            this.transmogFunc = once(() => doTransmog({
                settings,
                manualData,
                userTransmogData,
            }))
        }

        if (changedData.userData ||
            changedData.userAchievementData ||
            changedData.userQuestData ||
            changedData.userAchievementData ||
            changedHashes.zoneMapState)
        {
            this.zoneMapsFunc = once(() => doZoneMaps({
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

        console.timeEnd('LazyStore.update')
    }

    private hashObject(obj: object): string {
        const entries = Object.entries(obj)
        entries.sort()
        return entries.map(([key, value]) => `${key}_${value}`)
            .join('|')
    }

    lookup(key: string): UserCounts {
        return this[key as LazyKey]
    }

    get appearances(): UserCounts { return this.appearancesFunc() }
    get dragonriding(): UserCounts { return this.dragonridingFunc() }
    get heirlooms(): UserCounts { return this.heirloomsFunc() }
    get illusions(): UserCounts { return this.illusionsFunc() }
    get journal(): LazyJournal { return this.journalFunc() }
    get mounts(): UserCounts { return this.mountsFunc() }
    get pets(): UserCounts { return this.petsFunc() }
    get toys(): UserCounts { return this.toysFunc() }
    get transmog(): LazyTransmog { return this.transmogFunc() }
    get zoneMaps(): LazyZoneMaps { return this.zoneMapsFunc() }

    private doGeneric<T extends GenericCategory<U>, U>(
        categories: T[],
        haveFunc: (item: U) => boolean,
        totalCountFunc?: (item: U) => number,
        haveCountFunc?: (item: U) => number
    ): UserCounts {
        const counts: UserCounts = {}
        const overallData = counts['OVERALL'] = new UserCount()

        for (const category of categories) {
            const categoryUnavailable = category.name.startsWith('Unavailable')
            const availabilityData = counts[categoryUnavailable ? 'UNAVAILABLE' : 'AVAILABLE'] ||= new UserCount()
            const categoryData = counts[category.name] = new UserCount()

            for (const item of category.items) {
                const totalCount = totalCountFunc?.(item) || 1
                overallData.total += totalCount
                availabilityData.total += totalCount
                categoryData.total += totalCount

                if (haveFunc(item)) {
                    const haveCount = haveCountFunc?.(item) || 1
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
            const parentData = counts[key.split('--')[0]] = new UserCount()
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
                    
                    if (this.userTransmogData.userHas[appearance.appearanceId]) {
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

    private doDragonriding(): UserCounts {
        const counts: UserCounts = {}
        const overallData = counts['OVERALL'] = new UserCount()
        
        for (const category of this.manualData.dragonriding) {
            const sectionData = counts[category.name] = new UserCount()

            for (const group of category.groups) {
                const groupData = counts[`${category.name}--${group.name}`] = new UserCount()

                for (const { questId } of group.things) {
                    overallData.total++
                    sectionData.total++
                    groupData.total++
                    
                    if (this.userQuestData.accountHas.has(questId)) {
                        overallData.have++
                        sectionData.have++
                        groupData.have++
                    }
                }
            }
        }

        return counts
    }

    private doHeirlooms(): UserCounts {
        return this.doGeneric(
            this.manualData.heirlooms,
            (heirloom: ManualDataHeirloomItem) => this.userData.heirlooms?.[heirloom.itemId] > 0,
            (heirloom: ManualDataHeirloomItem) => heirloom.maxUpgrade,
            (heirloom: ManualDataHeirloomItem) => this.userData.heirlooms?.[heirloom.itemId] || 0,
        )
    }

    private doIllusions(): UserCounts {
        return this.doGeneric(
            this.manualData.illusions,
            (illusion: ManualDataIllusionItem) => this.userTransmogData.hasIllusion[
                find(
                    this.staticData.illusions,
                    (staticIllusion) => staticIllusion.enchantmentId === illusion.enchantmentId
                )?.enchantmentId
            ]
        )
    }

    private doSetCounts(
        categories: ManualDataSetCategory[][],
        userHas: Record<number, boolean>
    ): UserCounts {
        const counts: UserCounts = {}
        const showUnavailable = !this.settings.collections.hideUnavailable

        const overallData = counts['OVERALL'] = new UserCount()
        const overallSeen: Record<number, boolean> = {}

        for (const category of categories) {
            if (category === null) {
                continue
            }

            const categoryData = counts[category[0].slug] = new UserCount()
            const categoryUnavailable = category[0].slug === 'unavailable'

            for (const set of category) {
                const setData = counts[`${category[0].slug}--${set.slug}`] = new UserCount()
                const setUnavailable = set.slug === 'unavailable'

                for (const group of set.groups) {
                    const groupData = counts[`${category[0].slug}--${set.slug}--${group.name}`] = new UserCount()
                    const groupUnavailable = group.name.indexOf('Unavailable') >= 0

                    for (const things of group.things) {
                        const hasThing = some(things, (t) => userHas[t])
                        const seenOverall = some(things, (t) => overallSeen[t])

                        const doOverall = (
                            !seenOverall &&
                            (hasThing || (!categoryUnavailable && !setUnavailable && !groupUnavailable))
                        )
                        const doCategory = (
                            (hasThing || (
                                (!setUnavailable && !groupUnavailable) &&
                                (showUnavailable || !categoryUnavailable)
                            ))
                        )
                        const doSet = (
                            hasThing ||
                            showUnavailable ||
                            (!groupUnavailable && !setUnavailable && !categoryUnavailable)
                        )

                        if (doOverall) {
                            overallData.total++
                        }
                        if (doCategory) {
                            categoryData.total++
                        }
                        if (doSet) {
                            setData.total++
                            groupData.total++
                        }

                        if (hasThing) {
                            if (doOverall) {
                                overallData.have++
                            }
                            if (doCategory) {
                                categoryData.have++
                            }
                            if (doSet) {
                                setData.have++
                                groupData.have++
                            }
                        }

                        for (const thing of things) {
                            overallSeen[thing] = true
                        }
                    }
                }
            }
        }

        return counts
    }
}

const storeInstance = new LazyStore()
