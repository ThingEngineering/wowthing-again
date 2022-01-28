import type { UserCount } from '@/types'


export interface UserTransmogData {
    sources: string[]
    transmog: number[]

    sourceHas?: Record<string, boolean>
    stats?: Record<string, UserCount>
    userHas?: Record<number, boolean>
}
