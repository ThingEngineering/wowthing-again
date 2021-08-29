import type {Dictionary} from '@/types'


export interface TransmogData {
    sets: TransmogDataCategory[][]
}

export interface TransmogDataCategory {
    name: string
    slug: string
    groups: TransmogDataGroup[]
    skipClasses: string[]
}

export interface TransmogDataGroup {
    name: string
    tag: string
    type: string
    data: Dictionary<TransmogDataGroupData[]>
    sets: string[]
}

export interface TransmogDataGroupData {
    name: string
    items: Dictionary<number[]>
}
