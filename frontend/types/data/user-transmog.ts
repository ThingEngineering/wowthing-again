import type { UserCount } from '@/types'


export interface UserTransmogData {
    stats?: Record<string, UserCount>
    transmog: number[]

    userHas?: Record<number, boolean>
}
