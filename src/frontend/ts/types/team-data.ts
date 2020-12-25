import type {Character} from './character'

export class TeamData {
    defaultRealmId: number
    description: string
    name: string
    region: number

    characters: TeamDataCharacter[]
}

class TeamDataCharacter {
    character: Character
}
