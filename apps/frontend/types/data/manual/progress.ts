import type { ProgressDataType } from '@/types/enums'


export interface ManualDataProgressCategory {
    minimumLevel?: number
    name: string
    slug: string
    requiredQuestIds: number[]
    groups: ManualDataProgressGroup[]
}

export interface ManualDataProgressGroup {
    icon: string
    iconText?: string
    lookup: string
    minimumLevel?: number
    name: string
    type: string
    data: Record<string, ManualDataProgressData[]>
}

export interface ManualDataProgressData {
    ids: number[]
    description?: string
    name: string
    type: ProgressDataType
    value?: number
}
