export interface Settings {
    general: {
        minimumLevel: number
        showClassIcon: boolean
        showItemLevel: boolean
        showRaceIcon: boolean
        showRealm: boolean
        showSpecIcon: boolean
        useWowdb: boolean
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
}
