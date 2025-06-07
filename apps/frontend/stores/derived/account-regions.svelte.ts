import { get } from 'svelte/store';

import { settingsState } from '@/shared/state/settings.svelte';

import { userStore } from '../user';

export function createAccountRegions() {
    const value = $derived.by(() => {
        const userData = get(userStore);
        const regionSet = new Set<number>();
        for (const account of Object.values(userData.accounts || {})) {
            if (
                settingsState.value.accounts?.[account.id]?.enabled ||
                !settingsState.value.characters.hideDisabledAccounts
            ) {
                regionSet.add(account.region);
            }
        }

        return Array.from(regionSet) || [1, 2, 3, 4];
    });

    return {
        get value() {
            return value;
        },
    };
}

export const accountRegions = createAccountRegions();
