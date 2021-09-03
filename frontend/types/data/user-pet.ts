import type { Dictionary } from '@/types/dictionary'


export interface UserPetData {
    pets: Dictionary<UserPetDataPet[]>
}

export interface UserPetDataPet {
    breedId: number
    level: number
    quality: number
}
