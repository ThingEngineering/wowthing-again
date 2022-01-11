import type { Language } from '@/types/enums'


export interface Settings {
    characters: {
        hiddenCharacters: number[]
    }

    general: {
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
        covenantColumn: 'current' | 'all'
        padding: 'small' | 'medium' | 'large'
    }

    privacy: {
        anonymized: boolean
        public: boolean
        publicCurrencies: boolean
        publicLockouts: boolean
        publicMythicPlus: boolean
        publicQuests: boolean
        publicTransmog: boolean
        showInLeaderboards: boolean
    }

    transmog: {
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
