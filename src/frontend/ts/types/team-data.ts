import type {Character} from './character'

export class TeamData {
    defaultRealmId: number
    description: string
    name: string
    region: number

    characters: TeamDataCharacter[]
}

export class TeamDataCharacter {
    character: Character
    note: string
}
