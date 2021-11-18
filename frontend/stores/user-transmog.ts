import some from 'lodash/some'
import toPairs from 'lodash/toPairs'

import { Settings, UserCount, WritableFancyStore } from '@/types'
import getSkipClasses from '@/utils/get-skip-classes'
import type { TransmogData, UserTransmogData } from '@/types/data'


export class UserTransmogDataStore extends WritableFancyStore<UserTransmogData> {
    get dataUrl(): string {
        let url = document.getElementById('app')?.getAttribute('data-user')
        if (url) {
            url += '/transmog'
        }
        return url
    }

    initialize(data: UserTransmogData): void {
        console.time('UserTransmogDataStore.initialize')

        data.userHas = {}
        for (const transmogId of data.transmog) {
            data.userHas[transmogId] = true
        }

        console.timeEnd('UserTransmogDataStore.initialize')
    }

    setup(settings: Settings, transmogData: TransmogData, userTransmogData: UserTransmogData): void {
        console.time('UserTransmogDataStore.setup')

        const skipClasses = getSkipClasses(settings)

        const seen: Record<number, boolean> = {}
        const stats: Record<string, UserCount> = {}

        const overallStats = stats['OVERALL'] = new UserCount()

        for (const categories of transmogData.sets) {
            if (categories === null) {
                continue
            }

            const baseStats = stats[categories[0].slug] = new UserCount()

            for (const category of categories.slice(1)) {
                const catKey = `${categories[0].slug}--${category.slug}`
                const catStats = stats[catKey] = new UserCount()

                for (const group of category.groups) {
                    for (const [dataKey, dataValue] of toPairs(group.data)) {
                        if (skipClasses[dataKey]) {
                            continue
                        }

                        const groupKey = `${catKey}--${group.name}`
                        for (let setIndex = 0; setIndex < dataValue.length; setIndex++) {
                            if (group.sets[setIndex].endsWith('*')) {
                                continue
                            }

                            const setKey = `${groupKey}--${setIndex}`
                            const setStats = stats[setKey] = stats[setKey] || new UserCount()

                            const groupSigh = dataValue[setIndex]
                            const slotKeys = Object.keys(groupSigh.items)
                                .map((key) => parseInt(key))

                            for (const slotKey of slotKeys) {
                                const transmogIds = groupSigh.items[slotKey]
                                const seenAny = some(transmogIds, (id) => seen[id])

                                if (!seenAny) {
                                    overallStats.total++
                                }
                                baseStats.total++
                                catStats.total++
                                setStats.total++

                                for (const transmogId of transmogIds) {
                                    if (userTransmogData.userHas[transmogId]) {
                                        if (!seen[transmogId]) {
                                            overallStats.have++
                                        }
                                        baseStats.have++
                                        catStats.have++
                                        setStats.have++
                                        break
                                    }
                                }

                                for (const transmogId of transmogIds) {
                                    seen[transmogId] = true
                                }
                            }
                        }
                    }
                }
            }
        }

        this.update((state) => {
            state.data.stats = stats
            return state
        })

        console.timeEnd('UserTransmogDataStore.setup')
    }
}

export const userTransmogStore = new UserTransmogDataStore()
