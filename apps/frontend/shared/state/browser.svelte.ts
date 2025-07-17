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
    explore: {
        achievementId: number;
        bonusIds: string;
        questId: number;
        transmogSetId: number;
    };
    heirlooms: {
        highlightMissing: boolean;
        showCollected: boolean;
        showUncollected: boolean;
    };
    home: {
        activeView: string;
    };
    illusions: {
        highlightMissing: boolean;
        showCollected: boolean;
        showUncollected: boolean;
    };
    journal: {
        filtersExpanded: boolean;

        highlightMissing: boolean;
        showCollected: boolean;
        showUncollected: boolean;
        showLockouts: boolean;

        showCloth: boolean;
        showLeather: boolean;
        showMail: boolean;
        showPlate: boolean;

        showCloaks: boolean;
        showWeapons: boolean;

        showConvertible: boolean;
        showMounts: boolean;
        showPets: boolean;
        showRecipes: boolean;
        showTokens: boolean;
        showTrash: boolean;

        showDungeonNormal: boolean;
        showDungeonHeroic: boolean;
        showDungeonMythic: boolean;
        showDungeonTimewalking: boolean;

        showRaidLfr: boolean;
        showRaidNormal: boolean;
        showRaidHeroic: boolean;
        showRaidMythic: boolean;
        showRaidMythicOld: boolean;
        showRaidTimewalking: boolean;
        showRaid10: boolean;
        showRaid25: boolean;
    };
    lockouts: {
        grouped: boolean;
        onlyWithLockout: boolean;
        sortBy: number;
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
    vendors: {
        filtersExpanded: boolean;

        highlightMissing: boolean;
        showCollected: boolean;
        showUncollected: boolean;
        showCollectedPrices: boolean;

        showCloth: boolean;
        showLeather: boolean;
        showMail: boolean;
        showPlate: boolean;

        showCloaks: boolean;
        showCosmetics: boolean;
        showWeapons: boolean;

        showDragonriding: boolean;
        showIllusions: boolean;
        showMounts: boolean;
        showPets: boolean;
        showRecipes: boolean;
        showToys: boolean;

        showPvp: boolean;
        showTier: boolean;

        showAwakened: boolean;

        hiddenCurrencies: number[];
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
    explore: {
        achievementId: 0,
        bonusIds: '',
        questId: 0,
        transmogSetId: 0,
    },
    heirlooms: {
        highlightMissing: true,
        showCollected: true,
        showUncollected: true,
    },
    home: {
        activeView: '',
    },
    illusions: {
        highlightMissing: true,
        showCollected: true,
        showUncollected: true,
    },
    journal: {
        filtersExpanded: false,

        highlightMissing: true,
        showCollected: true,
        showUncollected: true,
        showLockouts: true,

        showCloth: true,
        showLeather: true,
        showMail: true,
        showPlate: true,

        showCloaks: true,
        showWeapons: true,

        showConvertible: true,
        showMounts: true,
        showPets: true,
        showRecipes: true,
        showTokens: true,
        showTrash: true,

        showDungeonNormal: true,
        showDungeonHeroic: true,
        showDungeonMythic: true,
        showDungeonTimewalking: true,

        showRaidLfr: true,
        showRaidNormal: true,
        showRaidHeroic: true,
        showRaidMythic: true,
        showRaidMythicOld: true,
        showRaidTimewalking: true,
        showRaid10: true,
        showRaid25: true,
    },
    lockouts: {
        grouped: false,
        onlyWithLockout: false,
        sortBy: 0,
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
    vendors: {
        filtersExpanded: false,
        highlightMissing: true,
        showCollected: true,
        showUncollected: true,
        showCollectedPrices: false,

        showCloth: true,
        showLeather: true,
        showMail: true,
        showPlate: true,

        showCloaks: true,
        showCosmetics: true,
        showWeapons: true,

        showDragonriding: true,
        showIllusions: true,
        showMounts: true,
        showPets: true,
        showRecipes: true,
        showToys: true,

        showPvp: true,
        showTier: true,

        showAwakened: true,

        hiddenCurrencies: [],
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
    save(state: BrowserStateIdk) {
        if (this._firstSave) {
            this._firstSave = false;
        } else {
            // console.log('save', state);
            localStorage.setItem(this._storageKey, JSON.stringify(state));
        }
    }
}

export const browserState = new BrowserState();
