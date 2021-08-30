import keys from 'lodash/keys'
import values from 'lodash/values'
import {get} from 'svelte/store'

import {Dictionary, WritableFancyStore} from '@/types'
import type { UserTransmogData } from '@/types/data'
import {UserTransmogDataHas} from '@/types/data'
import {transmogStore} from '@/stores/transmog'


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

        for (const baseSet of transmogData.sets) {
            const baseData = has[baseSet[0].slug] = new UserTransmogDataHas(0, 0)

            for (const set of baseSet.slice(1)) {
                const setData = has[`${baseSet[0].slug}--${set.slug}`] = new UserTransmogDataHas(0, 0)

                for (const group of set.groups) {
                    for (const groupData of values(group.data)) {
                        for (let groupIndex = 0; groupIndex < groupData.length; groupIndex++) {
                            if (group.sets[groupIndex] === 'Elite') {
                                continue
                            }

                            const groupSigh = groupData[groupIndex]
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
