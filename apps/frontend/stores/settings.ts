import { get, writable } from 'svelte/store'

import { professionCooldowns } from '@/data/professions/cooldowns'
import { hashObject } from '@/utils/hash-object'
import type { Account } from '@/types/account'
import type { FancyStoreFetchOptions } from '@/types/fancy-store'
import type { Settings } from '@/types/settings'

import { achievementStore } from './achievements'
import { journalStore } from './journal'
import { manualStore } from './manual'
import { staticStore } from '@/shared/stores/static'
import { userStore } from './user'
import { userAchievementStore } from './user-achievements'
import { userModifiedStore } from './user-modified'
import { userQuestStore } from './user-quests'
import { userTransmogStore } from './user-transmog'


export const settingsSavingState = writable<number>(0)

function createSettingsStore() {
    let hashValue = ''
    let hashTimer: NodeJS.Timer | null = null
    let refreshTimer: NodeJS.Timer | null = null

    const { set, subscribe, update } = writable<Settings>()

    return {
        set: (settings: Settings): void => {
            if (!settings) {
                console.warn('settings data is invalid!')
                return
            }

            if (hashTimer !== null) {
                clearInterval(hashTimer)
                hashTimer = null
            }
            if (refreshTimer !== null) {
                clearInterval(refreshTimer)
                refreshTimer = null
            }

            if (!get(userStore).public) {
                if (hashValue === '') {
                    hashValue = hashObject(settings)
                }

                for (const professionCooldown of professionCooldowns) {
                    if (settings.professions.cooldowns[professionCooldown.key] === undefined) {
                        settings.professions.cooldowns[professionCooldown.key] = true
                    }
                }

                hashTimer = setInterval(
                    async () => {
                        const newHashValue = hashObject(settings)
                        if (newHashValue !== hashValue) {
                            console.log('Saving settings...')
                            hashValue = newHashValue

                            settingsSavingState.set(1)
                            const xsrf = document.getElementById('app').getAttribute('data-xsrf')
                            const data = {
                                accounts: get(userStore).accounts,
                                settings,
                            }
                    
                            const response = await fetch('/api/settings', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'RequestVerificationToken': xsrf,
                                },
                                body: JSON.stringify(data),
                            })
                    
                            if (response.ok) {
                                const json = await response.json()
                                const settings = json.settings as Settings
                                settingsStore.set(settings)
                    
                                userStore.update(state => {
                                    for (const account of json.accounts as Account[]) {
                                        state.accounts[account.id] = account
                                    }
                                    return state
                                })
                    
                                const fetchOptions: Partial<FancyStoreFetchOptions> = {
                                    language: settings.general.language,
                                    evenIfLoaded: true,
                                    onlyIfLoaded: true,
                                }
                                await Promise.all([
                                    achievementStore.fetch(fetchOptions),
                                    journalStore.fetch(fetchOptions),
                                    manualStore.fetch(fetchOptions),
                                    staticStore.fetch(fetchOptions),
                                ])

                                settingsSavingState.set(2)
                            }
                        }
                    },
                    1000
                )

                if (settings.general.refreshInterval > 0) {
                    refreshTimer = setInterval(
                        async () => {
                            const oldData = get(userModifiedStore)
                            const oldAchievements = oldData.achievements
                            const oldGeneral = oldData.general
                            const oldQuests = oldData.quests
                            const oldTransmog = oldData.transmog

                            await userModifiedStore.fetch({ evenIfLoaded: true })

                            const newData = get(userModifiedStore)
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
            }

            set(settings)
        },
        subscribe,
        update,
    }
}

export const settingsStore = createSettingsStore()
settingsStore.set(
    JSON.parse(
        document.getElementById('app')
            .getAttribute('data-settings')
    ) as Settings
)
