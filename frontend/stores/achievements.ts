import { writable } from 'svelte/store'

import type {AchievementData, AchievementDataStore, WritableAchievementDataStore} from '@/types'
import fetch_json from '@/utils/fetch-json'


function getStore(): WritableAchievementDataStore {
    const store = writable<AchievementDataStore>({
        data: null,
        error: false,
        loading: true,
    })

    return {
        ...store,
        fetch: async function(): Promise<void> {
            const url = document.getElementById('app')?.getAttribute('data-achievements')
            if (!url) {
                store.update(state => {
                    state.error = true
                    return state
                })
                return
            }

            const json = await fetch_json(url)
            if (json === null) {
                store.update(state => {
                    state.error = true
                    return state
                })
                return
            }

            const achievementData = JSON.parse(json) as AchievementData

            store.update(state => {
                state.data = achievementData
                state.loading = false
                return state
            })
        },
    }
}

export const achievementStore = getStore()
//export achievementStore
