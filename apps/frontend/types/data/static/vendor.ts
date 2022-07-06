import type { FarmDropType, ItemQuality } from '@/types/enums'


export interface StaticDataVendorCategory {
    name: string
    slug: string
    groups: StaticDataVendorGroup[]
}

export interface StaticDataVendorGroup {
    name: string
    type: FarmDropType
    things: StaticDataVendorItem[]
    filteredThings: StaticDataVendorItem[]
}

export interface StaticDataVendorItem {
    id: number
    classMask: number
    quality: ItemQuality
    appearanceId?: number
    costs: Record<string, number>
}
