import debounce from 'lodash/debounce'
import find from 'lodash/find'
import once from 'lodash/once'
import some from 'lodash/some'
import { derived, get } from 'svelte/store'

import { manualStore } from './manual'
import { settingsStore } from './settings'
import { staticStore } from './static'
import { userStore } from './user'
import { userTransmogStore } from './user-transmog'
import { UserCount } from '@/types'
import type { FancyStoreType, Settings, UserData} from '@/types'
import type { ManualData, ManualDataHeirloomItem, ManualDataIllusionGroup, ManualDataIllusionItem, ManualDataSetCategory } from '@/types/data/manual'
import type { StaticData } from '@/types/data/static'
import type { UserTransmogData } from '@/types/data'
import type { StaticDataIllusion } from '@/types/data/static/illusion'


type GenericCategory<T> = {
    name: string
    items: T[]
}

export const userStatsStore = derived(
    [
        manualStore,
        settingsStore,
        userStore,
        userTransmogStore
    ],
    debounce(
        ([
            $manualStore,
            $settingsStore,
            $userStore,
            $userTransmogStore
        ]: [
            FancyStoreType<ManualData>,
            Settings,
            FancyStoreType<UserData>,
            FancyStoreType<UserTransmogData>
        ]) => {
            console.log('boing')
            storeInstance.update(
                $settingsStore,
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


type UserStatsKey =
    | 'mounts'
    | 'pets'
    | 'toys'

type UserStatsUgh = {
    [k in UserStatsKey]: Record<string, UserCount>
}

class UserStatsStore implements UserStatsUgh {
    private settings: Settings
    private staticData: StaticData

    private manualData: ManualData
    private userData: UserData
    private userTransmogData: UserTransmogData
    
    private heirloomsFunc: () => Record<string, UserCount>
    private illusionsFunc: () => Record<string, UserCount>
    private mountsFunc: () => Record<string, UserCount>
    private petsFunc: () => Record<string, UserCount>
    private toysFunc: () => Record<string, UserCount>

    private hashes: Record<string, string> = {}

    update(
        settings: Settings,
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

        this.manualData = manualData
        this.userData = userData
        this.userTransmogData = userTransmogData

        if (changedData.manualData || changedData.userData || changedHashes.collections) {
            this.mountsFunc = once(() => this.doSetCounts(this.manualData.mountSets, this.userData.hasMount))
            this.petsFunc = once(() => this.doSetCounts(this.manualData.petSets, this.userData.hasPet))
            this.toysFunc = once(() => this.doSetCounts(this.manualData.toySets, this.userData.hasToy))
        }

        if (changedData.manualData || changedData.userData) {
            this.heirloomsFunc = once(() => this.doHeirlooms())
        }

        if (changedData.manualData || changedData.userTransmogData) {
            this.illusionsFunc = once(() => this.doIllusions())
        }

        console.timeEnd('UserStatsStore.update')
    }

    lookup(key: string): Record<string, UserCount> {
        return this[key as UserStatsKey]
    }

    get heirlooms(): Record<string, UserCount> {
        return this.heirloomsFunc()
    }

    get illusions(): Record<string, UserCount> {
        return this.illusionsFunc()
    }

    get mounts(): Record<string, UserCount> {
        return this.mountsFunc()
    }

    get pets(): Record<string, UserCount> {
        return this.petsFunc()
    }

    get toys(): Record<string, UserCount> {
        return this.toysFunc()
    }

    private doGeneric<T extends GenericCategory<U>, U>(
        categories: T[],
        haveFunc: (item: U) => boolean,
        totalCountFunc?: (item: U) => number,
        haveCountFunc?: (item: U) => number
    ): Record<string, UserCount> {
        const counts: Record<string, UserCount> = {}
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

    private doHeirlooms(): Record<string, UserCount> {
        return this.doGeneric(
            this.manualData.heirlooms,
            (heirloom: ManualDataHeirloomItem) => this.userData.heirlooms?.[heirloom.itemId] > 0,
            (heirloom: ManualDataHeirloomItem) => heirloom.maxUpgrade,
            (heirloom: ManualDataHeirloomItem) => this.userData.heirlooms?.[heirloom.itemId] || 0,
        )
    }

    private doIllusions(): Record<string, UserCount> {
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
    ): Record<string, UserCount> {
        console.log('ey')
        const setCounts: Record<string, UserCount> = {}
        const showUnavailable = !this.settings.collections.hideUnavailable

        const overallData = setCounts['OVERALL'] = new UserCount()
        const overallSeen: Record<number, boolean> = {}

        for (const category of categories) {
            if (category === null) {
                continue
            }

            const categoryData = setCounts[category[0].slug] = new UserCount()
            const categoryUnavailable = category[0].slug === 'unavailable'

            for (const set of category) {
                const setData = setCounts[`${category[0].slug}--${set.slug}`] = new UserCount()
                const setUnavailable = set.slug === 'unavailable'

                for (const group of set.groups) {
                    const groupData = setCounts[`${category[0].slug}--${set.slug}--${group.name}`] = new UserCount()
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

        return setCounts
    }
}

const storeInstance = new UserStatsStore()
