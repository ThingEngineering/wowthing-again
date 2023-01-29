import debounce from 'lodash/debounce'
import some from 'lodash/some'
import { derived } from 'svelte/store'

import { manualStore } from './manual'
import { settingsStore } from './settings'
import { userStore } from './user'
import { UserCount, type Settings, type UserData } from '@/types'
import type { ManualData, ManualDataSetCategory } from '@/types/data/manual'


export const userStatsStore = derived(
    [manualStore, settingsStore, userStore],
    debounce(([
        $manualStore,
        $settingsStore,
        $userStore
    ]) => new UserStatsStore(
        $manualStore,
        $settingsStore,
        $userStore
    ),
    1000,
    {
        leading: true,
        trailing: true,
    }
))


class UserStatsStore {
    public counts: Record<string, Record<string, UserCount>>

    constructor(
        public manualData: ManualData,
        public settings: Settings,
        public userData: UserData
    )
    {
        console.time('UserStatsStore')

        this.counts = {
            mounts: {},
            pets: {},
            toys: {},
        }

        if (manualData === undefined || settings === undefined || userData === undefined) {
            return
        }

        this.doSetCounts(
            settings,
            'mounts',
            manualData.mountSets,
            userData.hasMount
        )
        this.doSetCounts(
            settings,
            'pets',
            manualData.petSets,
            userData.hasPet
        )
        this.doSetCounts(
            settings,
            'toys',
            manualData.toySets,
            userData.hasToy
        )

        console.timeEnd('UserStatsStore')
    }

    private doSetCounts(
        settings: Settings,
        countsKey: string,
        categories: ManualDataSetCategory[][],
        userHas: Record<number, boolean>
    ): void {
        const setCounts = this.counts[countsKey]
        const showUnavailable = !settings.collections.hideUnavailable

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
    }
}
