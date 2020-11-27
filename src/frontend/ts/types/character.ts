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
}
