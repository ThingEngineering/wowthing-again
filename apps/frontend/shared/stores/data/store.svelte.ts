import { Language } from '@/enums/language';
import { processDbData } from './db/process';
import type { DataDb, RawDb } from './db/types';
import { processManualData } from './manual/process';
import type { DataManual, RawManual } from './manual/types';

const requestInit: RequestInit = {
    credentials: 'include',
    mode: 'cors',
};

// Wrap loaded db/item/journal/manual/static data
class WowthingData {
    private baseUri: string;
    private error = false;
    private language: Language;

    public loaded = $state(false);

    public db: DataDb;
    public manual: DataManual;

    async fetch(language: Language) {
        console.time('WowthingData.fetch');

        this.baseUri = document.getElementById('app')?.getAttribute('data-base-uri');
        this.language = language;

        await Promise.all([
            this.fetchAndProcess('db', (rawData: RawDb) => (this.db = processDbData(rawData))),
            this.fetchAndProcess(
                'manual',
                (rawData: RawManual) => (this.manual = processManualData(rawData)),
            ),
        ]);

        console.timeEnd('WowthingData.fetch');

        this.loaded = true;

        console.log(this);
    }

    private async fetchAndProcess<TRawData, TData>(
        name: string,
        processFunc: (rawData: TRawData) => TData,
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
