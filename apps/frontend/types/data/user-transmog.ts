import type { UserCount } from '@/types'


export interface UserTransmogData {
    appearanceIds: number[]
    appearanceSources: string[]
    illusionIds: number[]

    hasAppearance?: Set<number>
    hasIllusion?: Set<number>
    hasSource?: Set<string>

    statsV2?: Record<string, UserCount>
}
