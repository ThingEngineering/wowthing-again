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
    groups: JournalDataEncounterItemGroup[]
}

export interface JournalDataEncounterItemGroup {
    name: string
    items: JournalDataEncounterItem[]
    itemsRaw: JournalDataEncounterItemArray[]
}

export class JournalDataEncounterItem {
    id: number
    classId: number
    classMask: number
    subclassId: number
    quality: number
    appearances: JournalDataEncounterItemAppearance[]

    constructor(
        id: number,
        quality: number,
        classId: number,
        subclassId: number,
        classMask: number,
        appearances: JournalDataEncounterItemAppearanceArray[]
    )
    {
        this.id = id
        this.quality = quality
        this.classId = classId
        this.subclassId = subclassId
        this.classMask = classMask
        this.appearances = appearances
            .map((appearanceArray) => new JournalDataEncounterItemAppearance(...appearanceArray))
    }
}

type JournalDataEncounterItemArray = ConstructorParameters<typeof JournalDataEncounterItem>

export class JournalDataEncounterItemAppearance {
    constructor(
        public appearanceId: number,
        public modifierId: number,
        public difficulties: number[]
    )
    {}
}

type JournalDataEncounterItemAppearanceArray = ConstructorParameters<typeof JournalDataEncounterItemAppearance>
