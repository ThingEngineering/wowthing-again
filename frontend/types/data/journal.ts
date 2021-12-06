import type { UserCount } from '@/types'


export interface JournalData {
    stats?: Record<string, UserCount>
    tiers: JournalDataTier[]
}

export interface JournalDataTier {
    id: number
    name: string
    slug: string
    instances: JournalDataInstance[]
}

export interface JournalDataInstance {
    id: number
    name: string
    slug: string
    bonusIds?: Record<number, number>
    encounters: JournalDataEncounter[]
}

export interface JournalDataEncounter {
    name: string
    items: JournalDataEncounterItem[]
}

export interface JournalDataEncounterItem {
    id: number
    quality: number
    appearances: JournalDataEncounterItemAppearance[]
}

export interface JournalDataEncounterItemAppearance {
    appearanceId: number
    modifierId: number
    difficulties: number[]
}
