import { get, writable } from 'svelte/store'

import { professionCooldowns } from '@/data/professions/cooldowns'
import { Language } from '@/enums/language'
import { hashObject } from '@/utils/hash-object'
import type { Account } from '@/types/account'
import type { FancyStoreFetchOptions } from '@/types/fancy-store'
import type { Settings } from '@/user-home/stores/settings/types/settings'

import { achievementStore } from '@/stores/achievements'
import { journalStore } from '@/stores/journal'
import { manualStore } from '@/stores/manual'
import { staticStore } from '@/shared/stores/static'
import { userStore } from '@/stores/user'
import { userAchievementStore } from '@/stores/user-achievements'
import { userModifiedStore } from '@/stores/user-modified'
import { userQuestStore } from '@/stores/user-quests'
import { userTransmogStore } from '@/stores/user-transmog'


const languageToSubdomain: Record<Language, string> = {
    [Language.deDE]: 'de',
    [Language.enUS]: 'www',
    [Language.esES]: 'es',
    [Language.esMX]: 'es',
    [Language.frFR]: 'fr',
    [Language.itIT]: 'it',
    [Language.ruRU]: 'ru',
    [Language.ptBR]: 'pt',
}


export const settingsSavingState = writable<number>(0)

function createSettingsStore() {
    let hashTimer: NodeJS.Timer | null = null
    let refreshTimer: NodeJS.Timer | null = null
    let accountsHash = ''
    let settingsHash = ''

    const store = writable<Settings>()

    return {
        get wowheadBaseUrl(): string {
            return `${languageToSubdomain[get(store).general.language]}.wowhead.com`
        },
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

            const userData = get(userStore)
            if (!userData.public) {
                if (accountsHash === '' && userData.accounts) {
                    accountsHash = hashObject(userData.accounts)
                }
                if (settingsHash === '') {
                    settingsHash = hashObject(settings)
                }

                for (const professionCooldown of professionCooldowns) {
                    if (settings.professions.cooldowns[professionCooldown.key] === undefined) {
                        settings.professions.cooldowns[professionCooldown.key] = true
                    }
                }

                hashTimer = setInterval(
                    async () => {
                        const userData = get(userStore)
                        const newAccountsHash = hashObject(userData.accounts)
                        if (accountsHash === '') {
                            accountsHash = newAccountsHash
                        }

                        const newSettingsHash = hashObject(settings)
                        if (newAccountsHash !== accountsHash || newSettingsHash !== settingsHash) {
                            accountsHash = newAccountsHash
                            settingsHash = newSettingsHash

                            settingsSavingState.set(1)
                            const xsrf = document.getElementById('app').getAttribute('data-xsrf')
                            const data = {
                                accounts: userData.accounts,
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

            store.set(settings)
        },
        subscribe: store.subscribe,
        update: store.update,
    }
}

export const settingsStore = createSettingsStore()
settingsStore.set(
    JSON.parse(
        document.getElementById('app')
            .getAttribute('data-settings')
    ) as Settings
)
