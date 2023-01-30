import debounce from 'lodash/debounce'
import once from 'lodash/once'
import some from 'lodash/some'
import { derived } from 'svelte/store'

import { manualStore } from './manual'
import { settingsStore } from './settings'
import { userStore } from './user'
import { UserCount, type FancyStoreType, type Settings, type UserData } from '@/types'
import type { ManualData, ManualDataSetCategory } from '@/types/data/manual'


export const userStatsStore = derived(
    [
        manualStore,
        settingsStore,
        userStore
    ],
    debounce(
        ([
            $manualStore,
            $settingsStore,
            $userStore
        ]: [
            FancyStoreType<ManualData>,
            Settings,
            FancyStoreType<UserData>
        ]) => {
            console.log('boing')
            storeInstance.update(
                $manualStore,
                $settingsStore,
                $userStore
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
    private manualData: ManualData
    private settings: Settings
    private userData: UserData
    
    private mountsFunc: () => Record<string, UserCount>
    private petsFunc: () => Record<string, UserCount>
    private toysFunc: () => Record<string, UserCount>

    private hashes: Record<string, string> = {}

    update(
        manualData: ManualData,
        settings: Settings,
        userData: UserData
    )
    {
        const newHashes: Record<string, string> = {
            mountsPetsToys: `${settings.collections.hideUnavailable}`,
        }
        const changedEntries = Object.entries(newHashes)
            .filter(([key, value]) => value !== this.hashes[key])

        const changedData = {
            manualData: this.manualData !== manualData,
            userData: this.userData !== userData,
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

        this.manualData = manualData
        this.settings = settings
        this.userData = userData

        if (
            changedHashes.mountsPetsToys ||
            changedData.manualData ||
            changedData.userData
        ) {
            this.mountsFunc = once(() => this.doSetCounts(this.manualData.mountSets, this.userData.hasMount))
            this.petsFunc = once(() => this.doSetCounts(this.manualData.petSets, this.userData.hasPet))
            this.toysFunc = once(() => this.doSetCounts(this.manualData.toySets, this.userData.hasToy))
        }

        console.timeEnd('UserStatsStore.update')
    }

    lookup(key: string): Record<string, UserCount> {
        return this[key as UserStatsKey]
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
