export interface Settings {
    characters: {
        hiddenCharacters: number[]
    }

    general: {
        minimumLevel: number
        refreshInterval: number
        useWowdb: boolean
        groupBy: string[]
        sortBy: string[]
    }

    layout: {
        commonFields: string[]
        homeFields: string[]
    }

    privacy: {
        anonymized: boolean
        public: boolean
        publicCurrencies: boolean
        publicLockouts: boolean
        publicMythicPlus: boolean
        publicTransmog: boolean
        showInLeaderboards: boolean
    }

    transmog: {
        showDeathKnight: boolean
        showDemonHunter: boolean
        showDruid: boolean
        showHunter: boolean
        showMage: boolean
        showMonk: boolean
        showPaladin: boolean
        showPriest: boolean
        showRogue: boolean
        showShaman: boolean
        showWarlock: boolean
        showWarrior: boolean
    }
}
