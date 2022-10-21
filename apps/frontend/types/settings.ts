import type { Language } from '@/enums'


export interface Settings {
    achievements: {
        showCharactersIfCompleted: boolean
    }

    auctions: {
        customCategories: SettingsAuctionCategory[]
        ignoredRealms: number[]
        minimumExtraPetsValue: number
    }

    characters: {
        defaultBackground: number
        hideDisabledAccounts: boolean
        hiddenCharacters: number[]
        pinnedCharacters: number[]
    }

    collections: {
        hideUnavailable: boolean
    }

    general: {
        desiredAccountName: string
        language: Language
        refreshInterval: number
        useWowdb: boolean
        groupBy: string[]
        sortBy: string[]
    }

    history: {
        hiddenRealms: number[]
    }

    layout: {
        commonFields: string[]
        homeFields: string[]
        homeLockouts: number[]
        homeTasks: string[]
        covenantColumn: 'current' | 'all'
        includeArchaeology: boolean
        padding: 'small' | 'medium' | 'large'
        showEmptyLockouts: boolean
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

export interface SettingsAuctionCategory {
    name: string
    itemIds: number[]
}

export interface SettingsChoice {
    key: string
    name: string
}
