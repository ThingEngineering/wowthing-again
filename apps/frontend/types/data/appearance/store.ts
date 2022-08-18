import type { AppearanceDataAppearanceArray } from './appearance'
import type { AppearanceDataSet } from './set'
import type { UserCount } from '@/types/user-count'


export interface AppearanceData {
    appearances: Record<string, Array<AppearanceDataSet>>
    stats: Record<string, UserCount>

    rawAppearances: Record<string, Array<AppearanceDataAppearanceArray>>
}
