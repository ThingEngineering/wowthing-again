import type { UserCount } from '@/types'


export interface UserVendorData {
    stats?: Record<string, UserCount>
    userHas?: Record<string, boolean>
}
