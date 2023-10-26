import type { RewardType } from '@/enums/reward-type'

export type ConvertibleCategory = {
    id: number
    minimumLevel: number
    name: string
    slug: string
    tiers?: number[]
    purchases?: [RewardType, number, number, number, string?][]
}
