import { Language } from '@/enums/language';

import { processDbData } from './db/process';
import { processItemsData } from './items/process';
import { processJournalData } from './journal/process';
import { processManualData } from './manual/process';
import { processStaticData } from './static/process';
import type { DataDb, RawDb } from './db/types';
import type { DataItems, RawItems } from './items/types';
import type { DataJournal, RawJournal } from './journal/types';
import type { DataManual, RawManual } from './manual/types';
import type { DataStatic, RawStatic } from './static/types';

const requestInit: RequestInit = {
    credentials: 'include',
    mode: 'cors',
};

interface WowthingDataOptions {
    loadDb: boolean;
    loadItems: boolean;
    loadJournal: boolean;
    loadManual: boolean;
    loadStatic: boolean;
}

// Wrap loaded db/item/journal/manual/static data
class WowthingData {
    private baseUri: string;
    private error = false;
    private language: Language;

    public loaded = $state(false);

    public db: DataDb;
    public items: DataItems;
    public journal: DataJournal;
    public manual: DataManual;
    public static: DataStatic;

    async fetch(language: Language, options: Partial<WowthingDataOptions> = {}) {
        console.time('WowthingData.fetch');

        this.baseUri = document.getElementById('app')?.getAttribute('data-base-uri');
        this.language = language;

        const promises: Promise<void>[] = [];
        if (options.loadDb !== false) {
            promises.push(
                this.fetchAndProcess('db', (rawData: RawDb) => (this.db = processDbData(rawData)))
            );
        }
        if (options.loadItems !== false) {
            promises.push(
                this.fetchAndProcess(
                    'item',
                    (rawData: RawItems) => (this.items = processItemsData(rawData))
                )
            );
        }
        if (options.loadJournal !== false) {
            promises.push(
                this.fetchAndProcess(
                    'journal',
                    (rawData: RawJournal) => (this.journal = processJournalData(rawData))
                )
            );
        }
        if (options.loadManual !== false) {
            promises.push(
                this.fetchAndProcess(
                    'manual',
                    (rawData: RawManual) => (this.manual = processManualData(rawData))
                )
            );
        }
        if (options.loadStatic !== false) {
            promises.push(
                this.fetchAndProcess(
                    'static',
                    (rawData: RawStatic) => (this.static = processStaticData(rawData))
                )
            );
        }

        await Promise.all(promises);

        console.timeEnd('WowthingData.fetch');

        this.loaded = true;

        console.log(this);
    }

    private async fetchAndProcess<TRawData, TData>(
        name: string,
        processFunc: (rawData: TRawData) => TData
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
