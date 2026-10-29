import sortBy from 'lodash/sortBy';
import sum from 'lodash/sum';
import { DateTime } from 'luxon';

import { Region } from '@/enums/region';
import type { RewardType } from '@/enums/reward-type';
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
import type { ApiWorldQuest, ApiWorldQuestReward } from '@/types/world-quests';

interface ApiDynamicData {
    region: number;
    delves: [number, string][];
    emissaryQuests: Record<number, [questId: number, expiresAt: number][]>;
    worldQuests: Record<number, [questId: number, jsonData: string][]>;
}

interface ApiWorldQuestJson {
    count: number;
    expirations: Record<string, number>;
    locations: Record<string, number>;
    rewards: Record<string, Record<string, number>>;
}

class DynamicData {
    public delves: { poiId: number; story: string }[] = [];
    public emissaryQuests: Record<number, { questId: number; expiresAt: DateTime }[]> = {};
    public worldQuests: Record<number, ApiWorldQuest[]> = {};
}

class DynamicDataStore {
    private static url = '/api/dynamic-data';
    public cache: Record<number, DynamicData> = $state({});
    private questsCache: Record<number, ApiWorldQuest[]> = {};
    private timer: ReturnType<typeof setInterval> = null;

    async startFetchTimer() {
        if (!this.timer) {
            this.timer = setInterval(() => {
                this.fetch(Region.US, true);
                this.fetch(Region.EU, true);
            }, 300_000);
        }
    }

    async fetch(region: number, force: boolean = false) {
        if (!this.cache[region] || force) {
            const xsrf = document.getElementById('app').getAttribute('data-xsrf');

            const response = await fetch(`${DynamicDataStore.url}/${region}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    RequestVerificationToken: xsrf,
                },
            });

            if (response.ok) {
                const responseData = (await response.json()) as ApiDynamicData;

                const finalData = (this.cache[region] = new DynamicData());

                // Delves
                for (const [poiId, story] of responseData.delves) {
                    finalData.delves.push({ poiId, story });
                }

                // EmissaryQuests
                for (const [expansion, emissaryQuests] of getNumberKeyedEntries(
                    responseData.emissaryQuests
                )) {
                    finalData.emissaryQuests[expansion] = [];
                    const expansionQuests = finalData.emissaryQuests[expansion];

                    for (const [questId, expiresAt] of emissaryQuests) {
                        expansionQuests.push({
                            questId,
                            expiresAt: DateTime.fromSeconds(expiresAt),
                        });
                    }
                }

                // World Quests
                for (const [zoneId, apiWorldQuests] of getNumberKeyedEntries(
                    responseData.worldQuests
                )) {
                    const zoneQuests: ApiWorldQuest[] = (finalData.worldQuests[zoneId] = []);

                    for (const [questId, jsonData] of apiWorldQuests) {
                        const parsed = JSON.parse(jsonData) as ApiWorldQuestJson;

                        const expires = DateTime.fromISO(
                            sortBy(
                                Object.entries(parsed.expirations),
                                ([, value]) => 1_000_000 - value
                            )[0][0],
                            { zone: 'utc' }
                        );
                        const locationParts = sortBy(
                            Object.entries(parsed.locations),
                            ([, value]) => 1_000_000 - value
                        )[0][0].split(' ');

                        const worldQuest: ApiWorldQuest = {
                            expires,
                            locationX: locationParts[0],
                            locationY: locationParts[1],
                            questId,
                            rewards: [],
                        };

                        for (const [rewardKey, rewardCounts] of Object.entries(parsed.rewards)) {
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

                        zoneQuests.push(worldQuest);
                    }
                }
            }
        }

        return this.getCached(region);
    }

    getCached(region: number): DynamicData {
        return (this.cache[region] ||= new DynamicData());
    }

    getCachedQuests(region: number) {
        if (!this.questsCache[region]) {
            const zones = this.getCached(region).worldQuests;
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
export const dynamicDataStore = new DynamicDataStore();
