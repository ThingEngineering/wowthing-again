import debounce from 'lodash/debounce'
import find from 'lodash/find'
import once from 'lodash/once'
import some from 'lodash/some'
import { derived, get } from 'svelte/store'

import { appearanceStore } from './appearance'
import { manualStore } from './manual'
import { settingsStore } from './settings'
import { staticStore } from './static'
import { userStore } from './user'
import { userTransmogStore } from './user-transmog'
import { UserCount } from '@/types'
import type { FancyStoreType, Settings, UserData} from '@/types'
import type { UserTransmogData } from '@/types/data'
import type {
    ManualData,
    ManualDataHeirloomItem,
    ManualDataIllusionItem,
    ManualDataSetCategory
} from '@/types/data/manual'
import type { StaticData } from '@/types/data/static'
import type { AppearanceData } from '@/types/data/appearance'



type UserStatsKey =
    | 'heirlooms'
    | 'illusions'
    | 'mounts'
    | 'pets'
    | 'toys'

type UserStatsUgh = {
    [k in UserStatsKey]: UserCounts
}

type GenericCategory<T> = {
    name: string
    items: T[]
}

type UserCounts = Record<string, UserCount>

export const userStatsStore = derived(
    [
        settingsStore,
        appearanceStore,
        manualStore,
        userStore,
        userTransmogStore
    ],
    debounce(
        ([
            $settingsStore,
            $appearanceStore,
            $manualStore,
            $userStore,
            $userTransmogStore
        ]: [
            Settings,
            FancyStoreType<AppearanceData>,
            FancyStoreType<ManualData>,
            FancyStoreType<UserData>,
            FancyStoreType<UserTransmogData>
        ]) => {
            storeInstance.update(
                $settingsStore,
                $appearanceStore,
                $manualStore,
                $userStore,
                $userTransmogStore
            )
            return storeInstance
        },
        1000,
        {
            leading: true,
            trailing: true,
        }
    )
)

class UserStatsStore implements UserStatsUgh {
    private settings: Settings
    private staticData: StaticData

    private appearanceData: AppearanceData
    private manualData: ManualData
    private userData: UserData
    private userTransmogData: UserTransmogData
    
    private appearancesFunc: () => Record<string, UserCount>
    private heirloomsFunc: () => Record<string, UserCount>
    private illusionsFunc: () => Record<string, UserCount>
    private mountsFunc: () => Record<string, UserCount>
    private petsFunc: () => Record<string, UserCount>
    private toysFunc: () => Record<string, UserCount>

    private hashes: Record<string, string> = {}

    update(
        settings: Settings,
        appearanceData: AppearanceData,
        manualData: ManualData,
        userData: UserData,
        userTransmogData: UserTransmogData
    )
    {
        const newHashes: Record<string, string> = {
            collections: `${settings.collections.hideUnavailable}`,
        }
        const changedEntries = Object.entries(newHashes)
            .filter(([key, value]) => value !== this.hashes[key])

        const changedData = {
            appearanceData: this.appearanceData !== appearanceData,
            manualData: this.manualData !== manualData,
            userData: this.userData !== userData,
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

        console.time('UserStatsStore.update')

        const changedHashes = Object.fromEntries(changedEntries)
        this.hashes = newHashes

        this.settings = settings
        this.staticData = get(staticStore)

        this.appearanceData = appearanceData
        this.manualData = manualData
        this.userData = userData
        this.userTransmogData = userTransmogData

        if (changedData.manualData || changedData.userData || changedHashes.collections) {
            this.mountsFunc = once(() => this.doSetCounts(this.manualData.mountSets, this.userData.hasMount))
            this.petsFunc = once(() => this.doSetCounts(this.manualData.petSets, this.userData.hasPet))
            this.toysFunc = once(() => this.doSetCounts(this.manualData.toySets, this.userData.hasToy))
        }

        if (changedData.appearanceData || changedData.userTransmogData) {
            this.appearancesFunc = once(() => this.doAppearances())
        }

        if (changedData.manualData || changedData.userData) {
            this.heirloomsFunc = once(() => this.doHeirlooms())
        }

        if (changedData.manualData || changedData.userTransmogData) {
            this.illusionsFunc = once(() => this.doIllusions())
        }

        console.timeEnd('UserStatsStore.update')
    }

    lookup(key: string): UserCounts {
        return this[key as UserStatsKey]
    }

    get appearances(): UserCounts {
        return this.appearancesFunc()
    }

    get heirlooms(): UserCounts {
        return this.heirloomsFunc()
    }

    get illusions(): UserCounts {
        return this.illusionsFunc()
    }

    get mounts(): UserCounts {
        return this.mountsFunc()
    }

    get pets(): UserCounts {
        return this.petsFunc()
    }

    get toys(): UserCounts {
        return this.toysFunc()
    }

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

const storeInstance = new UserStatsStore()
