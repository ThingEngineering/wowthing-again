import type { Language } from '@/types/enums'


export interface Settings {
    auctions: {
        ignoredRealms: number[]
        minimumExtraPetsValue: number
    }

    characters: {
        defaultBackground: number
        hiddenCharacters: number[]
        pinnedCharacters: number[]
    }

    general: {
        desiredAccountName: string
        language: Language
        refreshInterval: number
        useWowdb: boolean
        groupBy: string[]
        sortBy: string[]
    }

    layout: {
        commonFields: string[]
        homeFields: string[]
        homeLockouts: number[]
        homeWeeklies: string[]
        covenantColumn: 'current' | 'all'
        includeArchaeology: boolean
        padding: 'small' | 'medium' | 'large'
    }

    privacy: {
        anonymized: boolean
        public: boolean
        publicAccounts: boolean
        publicCurrencies: boolean
        publicLockouts: boolean
        publicMythicPlus: boolean
        publicQuests: boolean
        publicTransmog: boolean
        showInLeaderboards: boolean
    }

    transmog: {
        completionistMode: boolean

        showAllianceOnly: boolean
        showHordeOnly: boolean

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

export interface SettingsChoice {
    key: string
    name: string
}
