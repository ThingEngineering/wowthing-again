import { writable } from 'svelte/store'

import userStore from './user'
import type { Settings } from '@/types'


let interval: number | null = null

const { set, subscribe, update } = writable<Settings>()

export const data = {
    set: (settings: Settings): void => {
        if (interval !== null) {
            clearInterval(interval)
            interval = null
        }

        if (settings.general.refreshInterval >= 10) {
            interval = setInterval(async () => await userStore.fetch(), settings.general.refreshInterval * 1000 * 60)
        }

        set(settings)
    },
    subscribe,
    update,
}

//export const data = createData()
data.set(JSON.parse(document.getElementById('app').getAttribute('data-settings')) as Settings)
