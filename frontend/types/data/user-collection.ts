import type {UserCount} from '@/types'


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
    setCounts: Record<string, Record<string, UserCount>>
}

export interface UserCollectionDataPet {
    breedId: number
    level: number
    quality: number
}
