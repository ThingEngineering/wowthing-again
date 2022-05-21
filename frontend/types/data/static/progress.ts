import type { ProgressDataType } from '@/types/enums'


export interface StaticDataProgressCategory {
    minimumLevel?: number
    name: string
    slug: string
    requiredQuestIds: number[]
    groups: StaticDataProgressGroup[]
}

export interface StaticDataProgressGroup {
    icon: string
    iconText?: string
    lookup: string
    name: string
    type: string
    data: Record<string, StaticDataProgressData[]>
}

export interface StaticDataProgressData {
    ids: number[]
    description?: string
    name: string
    type: ProgressDataType
    value?: number
}
