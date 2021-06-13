import { writable } from 'svelte/store'

import type {UserData} from '@/types'
import fetch_json from '@/utils/fetch-json'
import initializeUser from '@/utils/initialize-user'


export const error = writable(false)
export const loading = writable(true)
export const data = writable<UserData>(undefined)

export const fetch = async function(): Promise<void> {
    const url = document.getElementById('app')?.getAttribute('data-user')
    if (!url) {
        error.set(true)
        return
    }

    const json = await fetch_json(url)
    if (json === null) {
        error.set(true)
        return
    }

    const userData = JSON.parse(json) as UserData
    userData.characters.sort((a, b) => {
        if (a.level != b.level) return b.level - a.level
        return a.name.localeCompare(b.name)
    })

    initializeUser(userData)

    data.set(userData)
    loading.set(false)
}

export default {
    error,
    loading,
    data,
    fetch,
}
