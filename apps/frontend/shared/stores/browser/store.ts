import { writable } from 'svelte/store';

import { objectKeys } from '@/utils/object-keys';

const storageKey = 'browserStore';

class BrowserState {
    auctions = new BrowserStateAuctions();
    home = new BrowserStateHome();
    matrix = new BrowserStateMatrix();
    tokens = new BrowserStateTokens();
}

class BrowserStateAuctions {
    commoditiesCurrentExpansion = true;
}

class BrowserStateHome {
    activeView: string = '';
}

class BrowserStateMatrix {
    minLevel = 0;
    showCharacterAs: 'level' | 'name' = 'level';
    showCovenant = false;
    showEmptyRows = false;
    xAxis: string[] = [];
    yAxis: string[] = [];
}

class BrowserStateTokens {
    highlightMissing = true;
    showCollected = true;
    showUncollected = true;
}

const initialState = new BrowserState();
const userJson = JSON.parse(localStorage.getItem(storageKey) ?? '{}');
for (const key of objectKeys(initialState)) {
    const subKeys = objectKeys(initialState[key]);

    Object.assign(initialState[key], userJson[key] || {});
    for (const objectKey of objectKeys(initialState[key])) {
        if (subKeys.indexOf(objectKey) === -1) {
            delete initialState[key][objectKey];
        }
    }
}

export const browserStore = writable<BrowserState>(initialState);

browserStore.subscribe((state) => {
    localStorage.setItem(storageKey, JSON.stringify(state));
});
