import type { SettingsAuctionCategory } from './auction-category'
import type { SettingsCustomGroup } from './custom-group'
import type { SettingsView } from './view'
import type { CharacterFlag } from '@/enums/character-flag'
import type { Language } from '@/enums/language'


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
        flags: Record<number, CharacterFlag>
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
        includeArchaeology: boolean
        newNavigation: boolean
        newNavigationIcons: boolean
        showEmptyLockouts: boolean
        showPartialLevel: boolean
        useClassColors: boolean

        navigationAppearances: boolean
        navigationCustomizations: boolean
        navigationMounts: boolean
        navigationPets: boolean
        navigationToys: boolean

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
