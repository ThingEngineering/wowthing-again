import { PersistentState } from '@friendofsvelte/state';

export interface CollectibleState {
    highlightMissing: boolean;
    showCollected: boolean;
    showUncollected: boolean;
}
export interface CollectiblePetsState extends CollectibleState {
    searchNoMaxLevel: boolean;
    searchNoRare: boolean;
}

const initialState = {
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
        xAxis: [] as string[],
        yAxis: [] as string[],
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

export const browserState = new PersistentState('browserState', initialState, 'localStorage');
