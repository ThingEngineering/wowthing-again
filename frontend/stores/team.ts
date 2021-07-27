import { writable } from 'svelte/store'

import type { TeamData } from '@/types'
import fetch_json from '@/utils/fetch-json'
import initializeTeam from '@/utils/initialize-team'

export const error = writable(false)
export const loading = writable(true)
export const data = writable<TeamData>()

export const fetch = async function (): Promise<void> {
    const url = document.getElementById('app').getAttribute('data-team')
    const json = await fetch_json(url)
    if (json === null) {
        error.set(true)
        return
    }

    const temp = JSON.parse(json)

    initializeTeam(temp)

    data.set(temp as TeamData)
    loading.set(false)
}

export default {
    error,
    loading,
    data,
    fetch,
}
