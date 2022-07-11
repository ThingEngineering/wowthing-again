import type { RewardType } from '@/types/enums'


export interface FarmStatus {
    characters: CharacterStatus[]
    need: boolean
    drops: DropStatus[]
}

export interface CharacterStatus {
    id: number
    types: RewardType[]
}

export interface DropStatus {
    need: boolean
    skip: boolean
    validCharacters: boolean
    characterIds: number[]
    completedCharacterIds: number[]
}
