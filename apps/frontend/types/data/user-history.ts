import type { DateTime } from 'luxon'


export interface UserHistoryData {
    gold: Record<number, [string, number][]>
    goldRaw: [string, [number, number, number][]][]
    
    lastUpdated: DateTime
}
