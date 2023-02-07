import { writable } from 'svelte/store'

import type { TeamData } from '@/types'
import fetchJson from '@/utils/fetch-json'
import initializeTeam from '@/utils/initialize-team'

export const error = writable(false)
export const loading = writable(true)
export const teamData = writable<TeamData>()

export const fetch = async function (): Promise<void> {
    const url = document.getElementById('app').getAttribute('data-team')
    const [data, ] = await fetchJson<TeamData>(url)
    if (data === null) {
        error.set(true)
        return
    }

    initializeTeam(data)

    teamData.set(data)
    loading.set(false)
}

export default {
    error,
    loading,
    data: teamData,
    fetch,
}
