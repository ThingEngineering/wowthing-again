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
        nameTooltipDisplay: string[]
    }

    collections: {
        hideUnavailable: boolean
    }

    general: {
        desiredAccountName: string
        language: Language
        refreshInterval: number
        useEnglishRealmNames: boolean
        useWowdb: boolean
        groupBy: string[]
        sortBy: string[]
    }

    history: {
        hiddenRealms: number[]
    }

    layout: {
        newNavigation: boolean
        newNavigationIcons: boolean

        includeArchaeology: boolean
        showEmptyLockouts: boolean
        showPartialLevel: boolean
        useClassColors: boolean

        covenantColumn: 'current' | 'all'
        padding: 'small' | 'medium' | 'large'
        commonFields: string[]
        homeFields: string[]
        homeLockouts: number[]
        homeTasks: string[]
    }

    leaderboard: {
        anonymous: boolean
        enabled: boolean
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

    professions: {
        dragonflightCountCraftingDrops: boolean
        dragonflightCountGathering: boolean
        dragonflightTreatises: boolean

        cooldowns: Record<string, boolean>
    }

    tasks: {
        disabledChores: Record<string, string[]>
    }

    transmog: {
        [index: string]: boolean

        completionistMode: boolean
        completionistSets: boolean

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

    customGroups: SettingsCustomGroup[]
    views: SettingsView[]
}

export interface SettingsAuctionCategory {
    name: string
    itemIds: number[]
}

export interface SettingsChoice {
    key: string
    name: string
}

export interface SettingsCustomGroup {
    filter: string
    id: string
    name: string
}

export interface SettingsView {
    id: string
    name: string

    groups: string[]
    groupBy: string[]
    sortBy: string[]

    commonFields: string[]
    homeFields: string[]

    homeLockouts: number[]
    homeTasks: string[]
}
