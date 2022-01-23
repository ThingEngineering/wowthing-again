import type { UserCount } from '@/types'


export interface UserTransmogData {
    sources: string[]
    transmog: number[]

    stats?: Record<string, UserCount>
    userHas?: Record<number, boolean>
}
