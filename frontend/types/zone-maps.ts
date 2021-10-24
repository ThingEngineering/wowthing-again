export interface FarmStatus {
    characters: CharacterStatus[]
    need: boolean
    drops: DropStatus[]
}

export interface CharacterStatus {
    id: number
    types: string[]
}

export interface DropStatus {
    need: boolean
    skip: boolean
    characterIds: number[]
}
