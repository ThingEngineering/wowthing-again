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
    encountersRaw: JournalDataEncounterArray[]
}

export class JournalDataEncounter {
    public id: number
    public name: string
    public groups: JournalDataEncounterItemGroup[]

    constructor(
        id: number,
        name: string,
        groupsRaw: JournalDataEncounterItemGroupArray[]
    )
    {
        this.id = id
        this.name = name
        this.groups = groupsRaw
            .map((groupArray) => new JournalDataEncounterItemGroup(...groupArray))
    }
}

type JournalDataEncounterArray = ConstructorParameters<typeof JournalDataEncounter>

export class JournalDataEncounterItemGroup {
    public name: string
    public items: JournalDataEncounterItem[]

    constructor(
        name: string,
        itemsRaw: JournalDataEncounterItemArray[]
    )
    {
        this.name = name
        this.items = itemsRaw
            .map((itemArray) => new JournalDataEncounterItem(...itemArray))
    }
}

type JournalDataEncounterItemGroupArray = ConstructorParameters<typeof JournalDataEncounterItemGroup>

export class JournalDataEncounterItem {
    public id: number
    public classId: number
    public classMask: number
    public subclassId: number
    public quality: number
    public appearances: JournalDataEncounterItemAppearance[]

    constructor(
        id: number,
        quality: number,
        classId: number,
        subclassId: number,
        classMask: number,
        appearancesRaw: JournalDataEncounterItemAppearanceArray[]
    )
    {
        this.id = id
        this.quality = quality
        this.classId = classId
        this.subclassId = subclassId
        this.classMask = classMask
        this.appearances = appearancesRaw
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
