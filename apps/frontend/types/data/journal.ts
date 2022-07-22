import type { UserCount } from '@/types'
import type { RewardType } from '../enums'


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
    public groups: JournalDataEncounterItemGroup[]
    public statistics?: Record<number, number>

    constructor(
        public id: number,
        public name: string,
        groupsRaw: JournalDataEncounterItemGroupArray[],
        statisticsRaw?: [number, number][]
    )
    {
        this.groups = groupsRaw
            .map((groupArray) => new JournalDataEncounterItemGroup(...groupArray))
        
        this.statistics = {}
        for (const [difficulty, statisticId] of (statisticsRaw || [])) {
            this.statistics[difficulty] = statisticId
        }
    }
}

type JournalDataEncounterArray = ConstructorParameters<typeof JournalDataEncounter>

export class JournalDataEncounterItemGroup {
    public items: JournalDataEncounterItem[]
    public filteredItems: JournalDataEncounterItem[]

    constructor(
        public name: string,
        itemsRaw: JournalDataEncounterItemArray[]
    )
    {
        this.items = itemsRaw
            .map((itemArray) => new JournalDataEncounterItem(...itemArray))
    }
}

type JournalDataEncounterItemGroupArray = ConstructorParameters<typeof JournalDataEncounterItemGroup>

export class JournalDataEncounterItem {
    public appearances: JournalDataEncounterItemAppearance[]

    constructor(
        public type: RewardType,
        public id: number,
        public quality: number,
        public classId: number,
        public subclassId: number,
        public classMask: number,
        appearancesRaw: JournalDataEncounterItemAppearanceArray[]
    )
    {
        this.appearances = (appearancesRaw || [])
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
