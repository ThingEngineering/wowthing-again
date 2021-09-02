import keys from 'lodash/keys'
import toPairs from 'lodash/toPairs'
import {get} from 'svelte/store'

import {Dictionary, WritableFancyStore} from '@/types'
import type { UserTransmogData } from '@/types/data'
import {UserTransmogDataHas} from '@/types/data'
import {data as settingsStore} from '@/stores/settings'
import {transmogStore} from '@/stores/transmog'
import getSkipClasses from '@/utils/get-skip-classes'


export class UserTransmogDataStore extends WritableFancyStore<UserTransmogData> {
    get dataUrl(): string {
        let url = document.getElementById('app')?.getAttribute('data-user')
        if (url) {
            url += '/transmog'
        }
        return url
    }

    setup(): void {
        console.time('setup UserTransmogDataStore')

        const has: Dictionary<UserTransmogDataHas> = {}
        const transmogData = get(transmogStore).data
        const userTransmogData = get(userTransmogStore).data

        const skipClasses = getSkipClasses(get(settingsStore))

        for (const baseSet of transmogData.sets) {
            if (baseSet === null) {
                continue
            }

            const baseData = has[baseSet[0].slug] = new UserTransmogDataHas(0, 0)

            for (const set of baseSet.slice(1)) {
                const setData = has[`${baseSet[0].slug}--${set.slug}`] = new UserTransmogDataHas(0, 0)

                for (const group of set.groups) {
                    for (const [dataKey, dataValue] of toPairs(group.data)) {
                        if (skipClasses[dataKey]) {
                            continue
                        }

                        for (let groupIndex = 0; groupIndex < dataValue.length; groupIndex++) {
                            if (group.sets[groupIndex].endsWith('*')) {
                                continue
                            }

                            const groupSigh = dataValue[groupIndex]
                            const slotKeys = keys(groupSigh.items)

                            baseData.total += slotKeys.length
                            setData.total += slotKeys.length

                            for (const slotKey of slotKeys) {
                                for (const transmogId of groupSigh.items[slotKey]) {
                                    if (userTransmogData.transmog[transmogId]) {
                                        baseData.have++
                                        setData.have++
                                        break
                                    }
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

        console.timeEnd('setup UserTransmogDataStore')
    }
}

export const userTransmogStore = new UserTransmogDataStore()
