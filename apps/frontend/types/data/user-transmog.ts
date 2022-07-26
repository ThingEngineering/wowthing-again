import type { UserCount } from '@/types'


export interface UserTransmogData {
    illusions: number[]
    sources: string[]
    transmog: number[]

    hasIllusion?: Record<number, boolean>
    sourceHas?: Record<string, boolean>
    stats?: Record<string, UserCount>
    userHas?: Record<number, boolean>
}
