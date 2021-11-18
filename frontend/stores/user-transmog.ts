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

    setup(settings: Settings, transmogData: TransmogData, userTransmogData: UserTransmogData): void {
        console.time('UserTransmogDataStore.setup')

        const skipClasses = getSkipClasses(settings)

        const has: Record<string, UserCount> = {}
        const overallData = has['OVERALL'] = new UserCount()
        const seen: Record<number, boolean> = {}

        for (const categories of transmogData.sets) {
            if (categories === null) {
                continue
            }

            const baseData = has[categories[0].slug] = new UserCount()

            for (const category of categories.slice(1)) {
                const catKey = `${categories[0].slug}--${category.slug}`
                const catData = has[catKey] = new UserCount()

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
                            const setData = has[setKey] = has[setKey] || new UserCount()

                            const groupSigh = dataValue[setIndex]
                            const slotKeys = Object.keys(groupSigh.items)
                                .map((key) => parseInt(key))

                            for (const slotKey of slotKeys) {
                                const transmogIds = groupSigh.items[slotKey]
                                const seenAny = some(transmogIds, (id) => seen[id])

                                if (!seenAny) {
                                    overallData.total++
                                }
                                baseData.total++
                                catData.total++
                                setData.total++

                                for (const transmogId of transmogIds) {
                                    if (userTransmogData.transmog[transmogId]) {
                                        if (!seen[transmogId]) {
                                            overallData.have++
                                        }
                                        baseData.have++
                                        catData.have++
                                        setData.have++
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
            state.data.has = has
            return state
        })

        console.timeEnd('UserTransmogDataStore.setup')
    }
}

export const userTransmogStore = new UserTransmogDataStore()
