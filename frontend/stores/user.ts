import { writable } from 'svelte/store'

import type { UserData, UserDataStore, WritableUserDataStore } from '@/types'
import fetch_json from '@/utils/fetch-json'
import initializeUser from '@/utils/initialize-user'


function getStore(): WritableUserDataStore {
    const store = writable<UserDataStore>({
        data: null,
        error: false,
        loading: true,
    })

    return {
        ...store,
        fetch: async function (): Promise<void> {
            const url = document.getElementById('app')?.getAttribute('data-user')
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

            const userData = JSON.parse(json) as UserData
            initializeUser(userData)

            store.update(state => {
                state.data = userData
                state.loading = false
                return state
            })
        },
    }
}

export const userStore = getStore()
//export default userStore
