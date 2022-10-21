import { get, writable } from 'svelte/store'

import { userAchievementStore } from './user-achievements'
import { userStore } from './user'
import { userQuestStore } from './user-quests'
import { userTransmogStore } from './user-transmog'
import type { Settings } from '@/types'


let interval: NodeJS.Timer | null = null

const { set, subscribe, update } = writable<Settings>()

export const data = {
    set: (settings: Settings): void => {
        if (interval !== null) {
            clearInterval(interval)
            interval = null
        }

        if (get(userStore).data.public === false && settings.general.refreshInterval > 0) {
            interval = setInterval(
                async () => await Promise.all([
                    userAchievementStore.fetch({ evenIfLoaded: true }),
                    userQuestStore.fetch({ evenIfLoaded: true }),
                    userStore.fetch({ evenIfLoaded: true }),
                    userTransmogStore.fetch({ evenIfLoaded: true }),
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
