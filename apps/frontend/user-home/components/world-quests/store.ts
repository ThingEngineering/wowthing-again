import sortBy from 'lodash/sortBy'
import sum from 'lodash/sum'
import { DateTime } from 'luxon'

import type { ApiWorldQuestRaw, ApiWorldQuestJson, ApiWorldQuest, ApiWorldQuestReward } from './types'
import type { RewardType } from '@/enums/reward-type'


class WorldQuestStore {
    private static url = '/api/world-quests/active'
    // private cache: Record<number, ]> = {}
    private cache: Record<string, Record<number, ApiWorldQuest[]>> = {}

    async fetch(region: number) {
        const cacheKey = [
            region
        ].join('--')

        if (!this.cache[cacheKey]) {
            const xsrf = document.getElementById('app')
                .getAttribute('data-xsrf')

            const response = await fetch(`${WorldQuestStore.url}/${region}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': xsrf,
                },
            })

            if (response.ok) {
                const responseData = await response.json() as ApiWorldQuestRaw[]
                
                const finalData: Record<number, ApiWorldQuest[]> = this.cache[region] = {}
                for (const apiWorldQuest of responseData) {
                    const jsonData = JSON.parse(apiWorldQuest.jsonData) as ApiWorldQuestJson

                    const expires = DateTime.fromISO(
                        sortBy(
                            Object.entries(jsonData.expirations),
                            ([, value]) => 1_000_000 - value
                        )[0][0],
                        { zone: 'utc' }
                    )
                    const locationParts = sortBy(
                        Object.entries(jsonData.locations),
                        ([, value]) => 1_000_000 - value
                    )[0][0].split(' ')

                    const worldQuest: ApiWorldQuest = {
                        expires,
                        locationX: locationParts[0],
                        locationY: locationParts[1],
                        questId: apiWorldQuest.questId,
                        rewards: [],
                    }
                    
                    for (const [rewardKey, rewardCounts] of Object.entries(jsonData.rewards)) {
                        const rewardReports = sum(Object.values(rewardCounts))
                        const rewards: ApiWorldQuestReward[] = []

                        for (const rewardString of rewardKey.split('|')) {
                            const rewardParts = rewardString.split('-')
                            rewards.push({
                                type: parseInt(rewardParts[0]) as RewardType,
                                id: parseInt(rewardParts[1]),
                                amount: parseInt(rewardParts[2]),
                            })
                        }

                        worldQuest.rewards.push([rewardReports, rewards])
                    }
                    
                    (finalData[apiWorldQuest.zoneId] ||= []).push(worldQuest)
                }
            }
        }

        return this.cache[cacheKey] || []
    }
}
export const worldQuestStore = new WorldQuestStore()
