import type { Dictionary } from '@/types/dictionary'
import type { UserCount } from '@/types'


export interface UserTransmogData {
    has?: Dictionary<UserCount>
    transmog: Dictionary<number>
}
