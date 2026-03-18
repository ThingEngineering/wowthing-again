import sortBy from 'lodash/sortBy';
import sum from 'lodash/sum';
import { DateTime } from 'luxon';

import type {
    ApiWorldQuestRaw,
    ApiWorldQuestJson,
    ApiWorldQuest,
    ApiWorldQuestReward,
} from './types';
import type { RewardType } from '@/enums/reward-type';

class WorldQuestStore {
    private static url = '/api/world-quests/active';
    private cache: Record<number, Record<number, ApiWorldQuest[]>> = {};
    private questsCache: Record<number, ApiWorldQuest[]> = {};

    async fetch(region: number) {
        if (!this.cache[region]) {
            const xsrf = document.getElementById('app').getAttribute('data-xsrf');

            const response = await fetch(`${WorldQuestStore.url}/${region}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    RequestVerificationToken: xsrf,
                },
            });

            if (response.ok) {
                const responseData = (await response.json()) as ApiWorldQuestRaw[];

                const finalData: (typeof this.cache)[number] = (this.cache[region] = {});
                for (const apiWorldQuest of responseData) {
                    const jsonData = JSON.parse(apiWorldQuest.jsonData) as ApiWorldQuestJson;

                    const expires = DateTime.fromISO(
                        sortBy(
                            Object.entries(jsonData.expirations),
                            ([, value]) => 1_000_000 - value
                        )[0][0],
                        { zone: 'utc' }
                    );
                    const locationParts = sortBy(
                        Object.entries(jsonData.locations),
                        ([, value]) => 1_000_000 - value
                    )[0][0].split(' ');

                    const worldQuest: ApiWorldQuest = {
                        expires,
                        locationX: locationParts[0],
                        locationY: locationParts[1],
                        questId: apiWorldQuest.questId,
                        rewards: [],
                    };

                    for (const [rewardKey, rewardCounts] of Object.entries(jsonData.rewards)) {
                        const rewardReports = sum(Object.values(rewardCounts));
                        const rewards: ApiWorldQuestReward[] = [];

                        for (const rewardString of rewardKey.split('|')) {
                            const rewardParts = rewardString.split('-');
                            rewards.push({
                                type: parseInt(rewardParts[0]) as RewardType,
                                id: parseInt(rewardParts[1]),
                                amount: parseInt(rewardParts[2]),
                            });
                        }

                        worldQuest.rewards.push([rewardReports, rewards]);
                    }

                    (finalData[apiWorldQuest.zoneId] ||= []).push(worldQuest);
                }
            }
        }

        return this.cache[region] || {};
    }

    getCached(region: number): Record<number, ApiWorldQuest[]> {
        return this.cache[region] || {};
    }

    getCachedQuests(region: number) {
        if (!this.questsCache[region]) {
            const zones = this.cache[region] || {};
            const questIdToExpiry = new Map<number, ApiWorldQuest>();
            for (const worldQuests of Object.values(zones)) {
                for (const worldQuest of worldQuests) {
                    questIdToExpiry.set(worldQuest.questId, worldQuest);
                }
            }
            const allQuests = sortBy(
                Array.from(questIdToExpiry.values()),
                (worldQuest) => worldQuest.expires
            );
            this.questsCache[region] = allQuests;
        }
        return this.questsCache[region];
    }

    isLoaded(region: number): boolean {
        return !!this.cache[region];
    }
}
export const worldQuestStore = new WorldQuestStore();
