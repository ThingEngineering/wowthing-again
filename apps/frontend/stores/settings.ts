import { writable } from 'svelte/store'

import { userStore } from './user'
import { userQuestStore } from './user-quests'
import { userTransmogStore } from './user-transmog'
import type { Settings } from '@/types'


let interval: number | null = null

const { set, subscribe, update } = writable<Settings>()

export const data = {
    set: (settings: Settings): void => {
        if (interval !== null) {
            clearInterval(interval)
            interval = null
        }

        if (settings.general.refreshInterval > 0) {
            interval = setInterval(
                async () => await Promise.all([
                    userQuestStore.fetch(false),
                    userStore.fetch(false),
                    userTransmogStore.fetch(false),
                ]),
                settings.general.refreshInterval * 1000 * 60
            )
        }

        set(settings)
    },
    subscribe,
    update,
}

//export const data = createData()
data.set(JSON.parse(document.getElementById('app').getAttribute('data-settings')) as Settings)
