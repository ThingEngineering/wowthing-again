import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'

import { fetch as userFetch } from './user'
import type { Settings } from '@/types'


let interval: number | null = null

function createData(): Writable<Settings> {
    const initial = JSON.parse(document.getElementById('app').getAttribute('data-settings')) as Settings
    const { set, subscribe, update } = writable(initial)

    return {
        set: (settings) => {
            set(settings)

            if (interval !== null) {
                clearInterval(interval)
                interval = null
            }

            if (settings.general.refreshInterval >= 10) {
                interval = setInterval(async () => await userFetch(), settings.general.refreshInterval * 1000 * 60)
            }
        },
        subscribe,
        update,
    }
}

export const data = createData()
