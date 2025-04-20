import debounce from 'lodash/debounce';
import merge from 'lodash/merge';
import { get, writable } from 'svelte/store';

import { Constants } from '@/data/constants';
import { expansionOrder } from '@/data/expansion';
import { professionCooldowns } from '@/data/professions/cooldowns';
import { Language } from '@/enums/language';
import { hashObject } from '@/utils/hash-object';
import type { Expansion, UserData } from '@/types';
import type { Account } from '@/types/account';
import type { FancyStoreFetchOptions } from '@/types/fancy-store';
import type { Settings } from './types';

import { achievementStore } from '@/stores/achievements';
import { journalStore } from '@/stores/journal';
import { manualStore } from '@/stores/manual';
import { staticStore } from '@/shared/stores/static';
import { userStore } from '@/stores/user';
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';

const languageToSubdomain: Record<Language, string> = {
    [Language.deDE]: 'de',
    [Language.enUS]: 'www',
    [Language.esES]: 'es',
    [Language.esMX]: 'es',
    [Language.frFR]: 'fr',
    [Language.itIT]: 'it',
    [Language.ruRU]: 'ru',
    [Language.ptBR]: 'pt',
};

export const settingsSavingState = writable<number>(0);

function createSettingsStore() {
    let hashTimer: ReturnType<typeof setInterval> | null = null;
    let accountsHash = '';
    let settingsHash = '';

    const store = writable<Settings>();

    return {
        get expansions(): Expansion[] {
            return expansionOrder.filter(
                (exp) => !get(store).collections.hideFuture || exp.id <= Constants.expansion,
            );
        },
        get wowheadBaseUrl(): string {
            return `${languageToSubdomain[get(store).general.language]}.wowhead.com`;
        },
        set: (settings: Settings): void => {
            if (!settings) {
                console.warn('settings data is invalid!');
                return;
            }

            if (hashTimer !== null) {
                clearInterval(hashTimer);
                hashTimer = null;
            }

            const userData = get(userStore);
            if (!userData.public) {
                if (accountsHash === '' && userData.accounts) {
                    accountsHash = hashObject(userData.accounts);
                }
                if (settingsHash === '') {
                    settingsHash = hashObject(settings);
                }

                for (const professionCooldown of professionCooldowns) {
                    if (settings.professions.cooldowns[professionCooldown.key] === undefined) {
                        settings.professions.cooldowns[professionCooldown.key] = true;
                    }
                }

                if (Object.keys(settings.professions.collectingCharactersV2 || {}).length === 0) {
                    for (const [professionId, characterId] of getNumberKeyedEntries(
                        settings.professions.collectingCharacters || {},
                    )) {
                        settings.professions.collectingCharactersV2[professionId] = [characterId];
                    }
                    settings.professions.collectingCharacters = {};
                }

                hashTimer = setInterval(async () => {
                    const userData = get(userStore);
                    const newAccountsHash = hashObject(userData.accounts);
                    if (accountsHash === '') {
                        accountsHash = newAccountsHash;
                    }

                    const settingsData = get(store);
                    const newSettingsHash = hashObject(settingsData);
                    if (newAccountsHash !== accountsHash || newSettingsHash !== settingsHash) {
                        accountsHash = newAccountsHash;
                        settingsHash = newSettingsHash;
                        await debouncedSaveData(settingsData, userData);
                    }
                }, 1000);
            }

            const currentSettings = get(store);
            if (currentSettings === undefined) {
                store.set(settings);
            } else {
                merge(currentSettings, settings);
                store.set(currentSettings);
            }
        },
        subscribe: store.subscribe,
        update: store.update,
    };
}

async function saveData(settings: Settings, userData: UserData) {
    settingsSavingState.set(1);
    const xsrf = document.getElementById('app').getAttribute('data-xsrf');
    const data = {
        accounts: userData.accounts,
        settings,
    };

    const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            RequestVerificationToken: xsrf,
        },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        const json = await response.json();
        const settings = json.settings as Settings;
        settingsStore.set(settings);

        userStore.update((state) => {
            for (const account of json.accounts as Account[]) {
                state.accounts[account.id] = account;
            }
            return state;
        });

        if (settings.general.language !== staticStore.language) {
            const fetchOptions: Partial<FancyStoreFetchOptions> = {
                language: settings.general.language,
                evenIfLoaded: true,
                onlyIfLoaded: true,
            };
            await Promise.all([
                achievementStore.fetch(fetchOptions),
                journalStore.fetch(fetchOptions),
                manualStore.fetch(fetchOptions),
                staticStore.fetch(fetchOptions),
            ]);
        }

        settingsSavingState.set(2);
    }
}
const debouncedSaveData = debounce(saveData, 1500);

export const settingsStore = createSettingsStore();
settingsStore.set(
    JSON.parse(document.getElementById('app').getAttribute('data-settings')) as Settings,
);
