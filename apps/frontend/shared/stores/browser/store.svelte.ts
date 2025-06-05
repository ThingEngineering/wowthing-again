import { writable } from 'svelte/store';

import { objectKeys } from '@/utils/object-keys';

const storageKey = 'browserStore';

interface BrowserState {
    auctions: {
        commoditiesCurrentExpansion: boolean;
    };
    home: {
        activeView: string;
    };
    matrix: {
        minLevel: number;
        showCharacterAs: 'level' | 'name';
        showCovenant: boolean;
        showEmptyRows: boolean;
        xAxis: string[];
        yAxis: string[];
    };
    settings: {
        selectedGroup: string;
        selectedView: string;
    };
    tokens: {
        highlightMissing: boolean;
        showCollected: boolean;
        showUncollected: boolean;
    };
}

const initialState: BrowserState = {
    auctions: {
        commoditiesCurrentExpansion: true,
    },
    home: {
        activeView: '',
    },
    matrix: {
        minLevel: 0,
        showCharacterAs: 'level',
        showCovenant: false,
        showEmptyRows: false,
        xAxis: [],
        yAxis: [],
    },
    settings: {
        selectedGroup: '',
        selectedView: '',
    },
    tokens: {
        highlightMissing: true,
        showCollected: true,
        showUncollected: true,
    },
};

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

const actualState = $state(initialState);
export const browserStore = writable<BrowserState>(actualState);

browserStore.subscribe((state) => {
    localStorage.setItem(storageKey, JSON.stringify($state.snapshot(state)));
});
