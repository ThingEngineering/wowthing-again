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
    data: Record<string, TransmogDataGroupData[]>
    sets: string[]
}

export interface TransmogDataGroupData {
    wowheadSetId: number
    name: string
    items: Record<number, number[]>
}
