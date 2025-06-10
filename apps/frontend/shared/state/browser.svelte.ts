import { objectKeys } from '@/utils/object-keys';

export interface CollectibleState {
    highlightMissing: boolean;
    showCollected: boolean;
    showUncollected: boolean;
}
interface CollectiblePetsState {
    searchNoMaxLevel: boolean;
    searchNoRare: boolean;
}
interface BrowserStateIdk {
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

    'collectible-customizations': CollectibleState;
    'collectible-mounts': CollectibleState;
    'collectible-pets': CollectibleState & CollectiblePetsState;
    'collectible-toys': CollectibleState;
}

const initialState: BrowserStateIdk = {
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
    'collectible-customizations': {
        highlightMissing: true,
        showCollected: true,
        showUncollected: true,
    },
    'collectible-mounts': {
        highlightMissing: true,
        showCollected: true,
        showUncollected: true,
    },
    'collectible-pets': {
        highlightMissing: true,
        searchNoMaxLevel: true,
        searchNoRare: false,
        showCollected: true,
        showUncollected: true,
    },
    'collectible-toys': {
        highlightMissing: true,
        showCollected: true,
        showUncollected: true,
    },
};

class BrowserState {
    private _firstSave = true;
    private _state = $state<BrowserStateIdk>(initialState);
    private _storageKey = 'browserState';

    constructor() {
        const userJson = JSON.parse(localStorage.getItem(this._storageKey) ?? '{}');
        for (const key of objectKeys(this._state)) {
            const subKeys = objectKeys(this._state[key]);

            Object.assign(this._state[key], userJson[key] || {});
            for (const objectKey of objectKeys(this._state[key])) {
                if (subKeys.indexOf(objectKey) === -1) {
                    delete this._state[key][objectKey];
                }
            }
        }

        console.log($state.snapshot(this._state));
    }

    get current() {
        return this._state;
    }

    // triggered via an $effect in @/user-home/Main.svelte, seems silly but it works
    public save(state: BrowserStateIdk) {
        if (this._firstSave) {
            this._firstSave = false;
        } else {
            console.log('save', state);
            localStorage.setItem(this._storageKey, JSON.stringify(state));
        }
    }
}

export const browserState = new BrowserState();
