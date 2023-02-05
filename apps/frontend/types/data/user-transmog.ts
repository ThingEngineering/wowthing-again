import type { UserCount } from '@/types'


export interface UserTransmogData {
    illusions: number[]
    sources: string[]
    transmog: number[]

    hasIllusion?: Record<number, boolean>
    sourceHas?: Record<string, boolean>
    userHas?: Record<number, boolean>

    //stats?: Record<string, UserCount>
    statsV2?: Record<string, UserCount>
}
