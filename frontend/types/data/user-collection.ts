import type {UserDataSetCount} from '@/types'
import type { Dictionary } from '@/types/dictionary'


export interface UserCollectionData {
    addonMounts: Record<number, boolean>
    pets: Record<number, UserCollectionDataPet[]>

    // Packed data
    mountsPacked: string
    toysPacked: string

    // Calculated data
    mounts: Record<number, boolean>
    petsHas: Record<number, boolean>
    toys: Record<number, boolean>
    setCounts: Dictionary<Dictionary<UserDataSetCount>>
}

export interface UserCollectionDataPet {
    breedId: number
    level: number
    quality: number
}
