import { writable } from 'svelte/store'

import fetch_json from '@/utils/fetch-json'
import type { StaticData } from '@/types'

export const error = writable(false)
export const loading = writable(true)
export const data = writable<StaticData>(undefined)

export const fetch = async function (): Promise<void> {
    const url = document.getElementById('app').getAttribute('data-static')
    const json = await fetch_json(url)
    if (json === null) {
        error.set(true)
        return
    }

    data.set(JSON.parse(json))
    loading.set(false)
}

export default {
    error,
    loading,
    data,
    fetch,
}
