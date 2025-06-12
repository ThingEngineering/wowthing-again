import { SvelteMap } from 'svelte/reactivity';

import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
import type { UserAchievementData } from '@/types';

export class DataUserAchievements {
    public achievementEarnedById = new SvelteMap<number, number>();
    public criteriaById = new SvelteMap<number, [number, number][]>();
    public statisticById = new SvelteMap<number, number>();

    public process(userAchievementData: UserAchievementData): void {
        console.time('DataUserAchievements.process');

        for (const [achievementId, earnedAt] of getNumberKeyedEntries(
            userAchievementData.achievements
        )) {
            this.achievementEarnedById.set(achievementId, earnedAt);
        }

        // addonAchievements?

        // [criteriaId, ...[value, ...characterIds]]
        // TODO: squish this data on the backend, it's huge
        for (const criteriaData of userAchievementData.rawCriteria) {
            const characterValues: [number, number][] = [];
            for (let i = 1; i < criteriaData.length; i++) {
                const sigh = criteriaData[i] as number[];
                for (let j = 1; j < sigh.length; j++) {
                    characterValues.push([sigh[j], sigh[0]]);
                }
            }
            this.criteriaById.set(criteriaData[0], characterValues);
        }

        // TODO: reduce this on the backend
        for (const [statisticId, characterData] of getNumberKeyedEntries(
            userAchievementData.statistics
        )) {
            this.statisticById.set(
                statisticId,
                characterData.reduce((a, b) => a + b[1], 0)
            );
        }

        console.timeEnd('DataUserAchievements.process');
    }
}
