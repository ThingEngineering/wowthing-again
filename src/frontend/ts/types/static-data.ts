import type {Dictionary} from './dictionary'


export class StaticData {
    Classes: Dictionary<StaticDataClass>
    Races: Dictionary<StaticDataRace>
    Realms: Dictionary<StaticDataRealm>
    Reputations: Dictionary<StaticDataReputation>
    ReputationTiers: Dictionary<StaticDataReputationTier>

    MountSets: any // FIXME
    MountToSpell: Dictionary<number>
    ReputationSets: any // FIXME
}

class StaticDataClass {
    Id: number
    Name: string
    Icon: string
    SpecializationIds: number[]
}

class StaticDataRace {
    Id: number
    Name: string
    IconFemale: string
    IconMale: string
}

class StaticDataRealm {
    Id: number
    Region: number
    Name: string
    Slug: string
}

class StaticDataReputation {
    Id: number
    Name: string
    TierId: number
}

class StaticDataReputationTier {
    Id: number
    MinValues: number[]
    MaxValues: number[]
    Names: string[]
}
