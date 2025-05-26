import { get } from 'svelte/store';

import { settingsStore } from '@/shared/stores/settings';
import { Language } from '@/enums/language';
import { processDbData } from './db/process';
import type { DataDb, RawDb } from './db/types';

const requestInit: RequestInit = {
    credentials: 'include',
    mode: 'cors',
};

// Wrap loaded db/item/journal/manual/static data
class WowthingData {
    private baseUri: string;
    private error = false;
    private language: Language;

    public loaded = false;

    public db: DataDb;

    async fetch() {
        console.time('WowthingData.fetch');

        this.baseUri = document.getElementById('app')?.getAttribute('data-base-uri');
        this.language = get(settingsStore).general.language;

        await Promise.all([
            this.fetchAndProcess('db', (rawData: RawDb) => (this.db = processDbData(rawData))),
        ]);

        console.timeEnd('WowthingData.fetch');

        this.loaded = true;

        console.log(this);
    }

    private async fetchAndProcess<TRawData>(
        name: string,
        processFunc: (rawData: TRawData) => DataDb,
    ) {
        const dataUrl = document.getElementById('app')?.getAttribute(`data-${name}`);
        const urlPath = dataUrl.replace('zzZZ', Language[this.language]);
        const url = this.baseUri + urlPath.substring(1);

        try {
            const request = new Request(url, requestInit);
            const response = await fetch(request);
            if (!response.ok) {
                console.error(response);
                throw response.statusText;
            }

            const json = (await response.json()) as TRawData;
            processFunc(json);
        } catch (err) {
            console.error(err);
            this.error = true;
        }
    }
}

export const wowthingData = new WowthingData();
