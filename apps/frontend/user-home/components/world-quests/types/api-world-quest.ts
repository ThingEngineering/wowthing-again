import type { RewardType } from '@/enums/reward-type'
import type { DateTime } from 'luxon'


export interface ApiWorldQuestRaw {
    jsonData: string
    questId: number
    region: number
    zoneId: number
}

export interface ApiWorldQuestJson {
    count: number
    expirations: Record<string, number>
    locations: Record<string, number>
    rewards: Record<string, Record<string, number>>
}

export interface ApiWorldQuest {
    expires: DateTime
    locationX: string
    locationY: string
    questId: number
    rewards: [number, ApiWorldQuestReward[]][]
}

export interface ApiWorldQuestReward {
    amount: number
    id: number
    type: RewardType
}
