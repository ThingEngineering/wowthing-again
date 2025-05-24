import { get } from 'svelte/store';

import { settingsStore } from '@/shared/stores/settings';
import { Language } from '@/enums/language';

const requestInit: RequestInit = {
    credentials: 'include',
    mode: 'cors',
};

// Wrap loaded db/item/journal/manual/static data
class DataStore {
    private baseUri: string;
    private error = false;
    private language: Language;

    async fetch() {
        this.baseUri = document.getElementById('app')?.getAttribute('data-base-uri');
        this.language = get(settingsStore).general.language;

        await Promise.all([this.fetchAndProcess('db')]);
    }

    private async fetchAndProcess(name: string) {
        const dataUrl = document.getElementById('app')?.getAttribute(`data-#{name}`);
        const urlPath = dataUrl.replace('zzZZ', Language[this.language]);
        const url = this.baseUri + urlPath.substring(1);
        // meow

        try {
            const request = new Request(url, requestInit);
            const response = await fetch(request);
            if (!response.ok) {
                console.error(response);
                throw response.statusText;
            }
            return [(await response.json()) ?? null, response.redirected];
        } catch (err) {
            console.error(err);
            this.error = true;
        }
    }
}

export const dataStore = new DataStore();
