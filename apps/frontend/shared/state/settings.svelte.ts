import debounce from 'lodash/debounce';
import { get } from 'svelte/store';
import { location } from 'svelte-spa-router';

// WARNING: do NOT import any of the other stores!
import { Constants } from '@/data/constants';
import { expansionOrder } from '@/data/expansion';
import { professionCooldowns } from '@/data/professions/cooldowns';
import { Language } from '@/enums/language';
import { sharedState } from '@/shared/state/shared.svelte';
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
import { hashObject } from '@/utils/hash-object.svelte';
import type { Expansion } from '@/types';
import type { Settings } from '../stores/settings/types';

import { browserStore } from '../stores/browser';

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

function createSettingsState() {
    let hashTimer: ReturnType<typeof setInterval> | null = null;
    let settingsHash = '';

    let settings = $state<Settings>();
    let saving = $state(0);

    let reactiveLocation = $state('');
    location.subscribe((state) => (reactiveLocation = state));

    const saveData = async () => {
        saving = 1;

        const response = await fetch('/api/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                RequestVerificationToken: sharedState.xsrf,
            },
            body: JSON.stringify({ settings }),
        });

        if (response.ok) {
            // const json = await response.json();
            // const settings = json.settings as Settings;
            // this.set(settings);
            saving = 2;
        }
    };
    const debouncedSaveData = debounce(saveData, 1500);

    const useAccountTags = $derived.by(() =>
        Object.values(settings.accounts).some((account) => !!account.tag)
    );

    const activeView = $derived.by(() => {
        const browserStoreValue = get(browserStore);

        return (
            (reactiveLocation === '/'
                ? settings.views.find((view) => view.id === browserStoreValue.home.activeView)
                : settings.views[0]) || settings.views[0]
        );
    });

    const commonColspan = $derived.by(() => {
        return (
            activeView.commonFields.length +
            (activeView.commonFields.indexOf('accountTag') >= 0 ? (useAccountTags ? 0 : -1) : 0)
        );
    });

    return {
        set(newSettings: Settings) {
            if (!newSettings) {
                console.warn('settings data is invalid!');
                return;
            }

            if (hashTimer !== null) {
                clearInterval(hashTimer);
                hashTimer = null;
            }

            saving = 0;
            settings = newSettings;

            if (sharedState.public) {
                return;
            }

            if (settingsHash === '') {
                settingsHash = hashObject(newSettings, []);
            }

            for (const professionCooldown of professionCooldowns) {
                if (newSettings.professions.cooldowns[professionCooldown.key] === undefined) {
                    newSettings.professions.cooldowns[professionCooldown.key] = true;
                }
            }

            if (Object.keys(newSettings.professions.collectingCharactersV2 || {}).length === 0) {
                for (const [professionId, characterId] of getNumberKeyedEntries(
                    newSettings.professions.collectingCharacters || {}
                )) {
                    newSettings.professions.collectingCharactersV2[professionId] = [characterId];
                }
                newSettings.professions.collectingCharacters = {};
            }

            hashTimer = setInterval(async () => {
                const settingsData = $state.snapshot(settings);
                const newSettingsHash = hashObject(settingsData);
                if (newSettingsHash !== settingsHash) {
                    settingsHash = newSettingsHash;
                    await debouncedSaveData();
                }
            }, 1000);
        },
        get value() {
            return settings;
        },
        get saving() {
            return saving;
        },
        get activeView() {
            return activeView;
        },
        get commonColspan() {
            return commonColspan;
        },
        get useAccountTags() {
            return useAccountTags;
        },
        get expansions(): Expansion[] {
            return expansionOrder.filter(
                (exp) => !settings.collections.hideFuture || exp.id <= Constants.expansion
            );
        },
        get wowheadBaseUrl(): string {
            return `${languageToSubdomain[settings.general.language]}.wowhead.com`;
        },
    };
}

export const settingsState = createSettingsState();
settingsState.set(
    JSON.parse(document.getElementById('app').getAttribute('data-settings')) as Settings
);
