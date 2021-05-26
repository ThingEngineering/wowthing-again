import type {Dictionary} from './dictionary'


export interface StaticData {
    Classes: Dictionary<StaticDataClass>
    Races: Dictionary<StaticDataRace>
    Realms: Dictionary<StaticDataRealm>
    Reputations: Dictionary<StaticDataReputation>
    ReputationTiers: Dictionary<StaticDataReputationTier>

    MountSets: StaticDataSetCategory[][]
    SpellToMount: Dictionary<number>

    PetSets: StaticDataSetCategory[][]
    CreatureToPet: Dictionary<number>

    ReputationSets: StaticDataReputationCategory[]

    ToySets: StaticDataSetCategory[][]

    RaiderIoScoreTiers: StaticDataRaiderIoScoreTier[]
}

interface StaticDataClass {
    Id: number
    Name: string
    Icon: string
    SpecializationIds: number[]
}

interface StaticDataRace {
    Id: number
    Name: string
    IconFemale: string
    IconMale: string
}

interface StaticDataRealm {
    Id: number
    Region: number
    Name: string
    Slug: string
}

// Reputations
export interface StaticDataReputation {
    Id: number
    Name: string
    TierId: number
}

export interface StaticDataReputationTier {
    Id: number
    MinValues: number[]
    MaxValues: number[]
    Names: string[]
}

interface StaticDataReputationCategory {
    Name: string
    Reputations: StaticDataReputationSet[][]
    Slug: string
}

export interface StaticDataReputationSet {
    Both: StaticDataReputationReputation
    Alliance: StaticDataReputationReputation
    Horde: StaticDataReputationReputation
    Paragon: boolean

    /*get tooltip(): string {
        if (this.Both) {
            return this.Both.Name;
        }
        else {
            return `[A] ${this.Alliance.Name}<br>[H] ${this.Horde.Name}`
        }
    }*/
}

interface StaticDataReputationReputation {
    Id: number
    Name: string
    Icon: string
    Note: string
}

// Sets
export interface StaticDataSetCategory {
    Name: string
    Slug: string
    Groups: StaticDataSetGroup[]
}

export interface StaticDataSetGroup {
    Name: string
    Things: number[][]
}

// RaiderIO
interface StaticDataRaiderIoScoreTier {
    Score: number
    RgbHex: string
}
