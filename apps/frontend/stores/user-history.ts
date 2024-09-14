import { DateTime } from 'luxon';

import { WritableFancyStore } from '@/types/fancy-store';
import type { UserHistoryData } from '@/types/data';

export class UserHistoryDataStore extends WritableFancyStore<UserHistoryData> {
    get dataUrl(): string {
        let url = document.getElementById('app')?.getAttribute('data-user');
        if (url) {
            url = url.replace(/\/(?:public|private).+$/, '/history');
        }
        return url;
    }

    initialize(userHistoryData: UserHistoryData): void {
        console.time('UserHistoryDataStore.initialize');

        if (userHistoryData.goldRaw === null) {
            return;
        }

        userHistoryData.lastUpdated = DateTime.utc();

        const realms: Record<number, [string, number][]> = {};
        const lastValue: Record<number, Record<number, number>> = {};
        for (const [time, dataPoints] of userHistoryData.goldRaw) {
            for (const [accountId, realmId, gold] of dataPoints) {
                if (lastValue[realmId] === undefined) {
                    lastValue[realmId] = {};
                }
                if (lastValue[realmId][accountId] === undefined) {
                    lastValue[realmId][accountId] = gold;
                }
                if (realms[realmId] === undefined) {
                    realms[realmId] = [];
                }
            }

            const timeData: Record<number, number> = {};
            const seen: Record<string, boolean> = {};
            for (const [accountId, realmId, gold] of dataPoints) {
                timeData[realmId] = (timeData[realmId] || 0) + gold;
                seen[[accountId, realmId].join('-')] = true;
                lastValue[realmId][accountId] = gold;
            }

            for (const realmId in lastValue) {
                for (const accountId in lastValue[realmId]) {
                    if (seen[[accountId, realmId].join('-')] !== true) {
                        timeData[realmId] =
                            (timeData[realmId] || 0) + lastValue[realmId][accountId];
                    }
                }
            }

            for (const realmId in timeData) {
                realms[realmId].push([time, timeData[realmId]]);
            }
        }

        userHistoryData.gold = realms;
        userHistoryData.goldRaw = null;

        console.timeEnd('UserHistoryDataStore.initialize');
    }
}

export const userHistoryStore = new UserHistoryDataStore();
