import type {Dictionary} from './dictionary'

export class Character {
    name: string
    realmId: number
    faction: number
    gender: number
    raceId: number
    classId: number
    level: number

    reputations: Dictionary<number>
    shadowlands?: CharacterShadowlands
}

class CharacterShadowlands {
    conduits: number[][]
    covenantId: number
    renownLevel: number
    soulbindId: number
}
