export interface Settings {
    general: {
        minimumLevel: number
        refreshInterval: number
        showClassIcon: boolean
        showItemLevel: boolean
        showRaceIcon: boolean
        showRealm: boolean
        showSpecIcon: boolean
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
        shareLockouts: boolean
        shareMythicPlus: boolean
        shareTransmog: boolean
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
