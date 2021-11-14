import type { UserCount } from '@/types'


export interface UserTransmogData {
    has?: Record<string, UserCount>
    transmog: Record<number, number>
}
