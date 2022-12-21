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
        defaultBackgroundId: number
        defaultBackgroundBrightness: number
        defaultBackgroundSaturation: number
        hideDisabledAccounts: boolean
        hiddenCharacters: number[]
        ignoredCharacters: number[]
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
        includeArchaeology: boolean
        showEmptyLockouts: boolean
        showPartialLevel: boolean
        covenantColumn: 'current' | 'all'
        padding: 'small' | 'medium' | 'large'
        commonFields: string[]
        homeFields: string[]
        homeLockouts: number[]
        homeTasks: string[]
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

    tasks: {
        disabledChores: Record<string, string[]>
    }

    transmog: {
        completionistMode: boolean

        showAllianceOnly: boolean
        showHordeOnly: boolean

        showDeathKnight: boolean
        showDemonHunter: boolean
        showDruid: boolean
        showEvoker: boolean
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
