import type { UserCount } from '@/types'


export interface UserTransmogData {
    illusions: number[]
    sources: string[]
    transmog: number[]

    hasAppearance?: Set<number>
    hasIllusion?: Set<number>
    hasSource?: Set<string>

    statsV2?: Record<string, UserCount>
}
