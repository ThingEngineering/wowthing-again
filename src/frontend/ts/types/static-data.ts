import type {Dictionary} from './dictionary'


export class StaticData {
    Classes: Dictionary<StaticDataClass>
    Races: Dictionary<StaticDataRace>
    Realms: Dictionary<StaticDataRealm>

    MountToSpell: Dictionary<number>
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
    Id: string
    Region: number
    Name: string
    Slug: string
}
