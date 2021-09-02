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

    home: {
        showCovenant: boolean
        showKeystone: boolean
        showMountSpeed: boolean
        showStatuses: boolean
        showTorghast: boolean
        showVaultMythicPlus: boolean
        showVaultPvp: boolean
        showVaultRaid: boolean
        showWeeklyAnima: boolean
        showWeeklyShapingFate: boolean
        showWeeklySouls: boolean
    }

    privacy: {
        anonymized: boolean
        public: boolean
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
