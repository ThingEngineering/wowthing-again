import { get, writable } from 'svelte/store'

import { userStore } from './user'
import { userAchievementStore } from './user-achievements'
import { userModifiedStore } from './user-modified'
import { userQuestStore } from './user-quests'
import { userTransmogStore } from './user-transmog'
import type { Settings } from '@/types'


let interval: NodeJS.Timer | null = null

const { set, subscribe, update } = writable<Settings>()

export const settingsStore = {
    set: (settings: Settings): void => {
        if (interval !== null) {
            clearInterval(interval)
            interval = null
        }

        if (settings.general.refreshInterval > 0) {
            interval = setInterval(
                async () => {
                    const oldData = get(userModifiedStore).data
                    const oldAchievements = oldData.achievements
                    const oldGeneral = oldData.general
                    const oldQuests = oldData.quests
                    const oldTransmog = oldData.transmog

                    await userModifiedStore.fetch({ evenIfLoaded: true })

                    const newData = get(userModifiedStore).data
                    if (oldAchievements < newData.achievements) {
                        userAchievementStore.fetch({ evenIfLoaded: true })
                    }
                    if (oldGeneral < newData.general) {
                        userStore.fetch({ evenIfLoaded: true })
                    }
                    if (oldQuests < newData.quests) {
                        userQuestStore.fetch({ evenIfLoaded: true })
                    }
                    if (oldTransmog < newData.transmog) {
                        userTransmogStore.fetch({ evenIfLoaded: true })
                    }
                },
                settings.general.refreshInterval * 1000 * 60
            )
        }

        set(settings)
    },
    subscribe,
    update,
}

settingsStore.set(
    JSON.parse(
        document.getElementById('app')
            .getAttribute('data-settings')
    ) as Settings
)
