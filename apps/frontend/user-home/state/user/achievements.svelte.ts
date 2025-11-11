import cloneDeep from 'lodash/cloneDeep';
import { SvelteMap } from 'svelte/reactivity';
import { get } from 'svelte/store';

import { achievementStore } from '@/stores';
import { achievementState } from '@/stores/local-storage/achievements';
import { UserAchievementDataCategory, type UserAchievementData } from '@/types';
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';

export class DataUserAchievements {
    public achievementEarnedById = new SvelteMap<number, number>();
    public criteriaById = new SvelteMap<number, [number, number][]>();
    public statisticById = new SvelteMap<number, number>();

    public categories = $derived.by(() => this._derivedStats.categories);
    public recent = $derived.by(() => this._derivedStats.recent);

    public addonAchievements: UserAchievementData['addonAchievements'] = $state({});

    public process(userAchievementData: UserAchievementData): void {
        console.time('DataUserAchievements.process');

        for (const [achievementId, earnedAt] of getNumberKeyedEntries(
            userAchievementData.achievements
        )) {
            this.achievementEarnedById.set(achievementId, earnedAt);
        }

        this.addonAchievements = cloneDeep(userAchievementData.addonAchievements);

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

    private _derivedStats = $derived.by(() => {
        console.time('DataUserAchievements._derivedStats');

        const achievementData = get(achievementStore);
        const achievementStateValue = get(achievementState);

        const categories = achievementData.categories;
        const keepIds: Record<number, boolean> = {};
        for (const category of categories) {
            if (category === null) {
                continue;
            }

            if (category.name !== 'Feats of Strength' && category.name !== 'Legacy') {
                keepIds[category.id] = true;
                for (const child of category.children.filter((child) => child !== null)) {
                    keepIds[child.id] = true;
                }
            }
        }

        const cheevs: Record<number, UserAchievementDataCategory> = {};
        cheevs[0] = new UserAchievementDataCategory(0, 0, 0, 0);

        const all: [number, number][] = [];
        const allSeen = new Set<number>();
        for (const achievement of Object.values(achievementData.achievement)) {
            if (
                (achievement.faction === 1 && !achievementStateValue.showHorde) ||
                (achievement.faction === 0 && !achievementStateValue.showAlliance) ||
                (achievement.flags & 0x100_000) > 0
            ) {
                // console.log('skip', achievement)
                continue;
            }

            const categoryIds = [achievement.categoryId];
            if (achievementData.achievementToCategory[achievement.id]) {
                categoryIds.push(achievementData.achievementToCategory[achievement.id]);
            }

            for (const categoryId of categoryIds) {
                if (!cheevs[categoryId]) {
                    cheevs[categoryId] = new UserAchievementDataCategory(0, 0, 0, 0);
                }

                cheevs[categoryId].total++;
                cheevs[categoryId].totalPoints += achievement.points;

                if (keepIds[categoryId]) {
                    cheevs[0].total++;
                    cheevs[0].totalPoints += achievement.points;
                }

                const earnedAt = this.achievementEarnedById.get(achievement.id);
                if (earnedAt) {
                    if (!allSeen.has(achievement.id)) {
                        all.push([earnedAt, achievement.id]);
                        allSeen.add(achievement.id);
                    }

                    cheevs[categoryId].have++;
                    cheevs[categoryId].havePoints += achievement.points;

                    if (keepIds[categoryId]) {
                        cheevs[0].have++;
                        cheevs[0].havePoints += achievement.points;
                    }
                }
            }
        }

        for (const category of achievementData.categories.filter((cat) => cat !== null)) {
            if (!cheevs[category.id]) {
                cheevs[category.id] = new UserAchievementDataCategory(0, 0, 0, 0);
            }

            for (const child of category.children.filter((child) => child !== null)) {
                // Statistics
                if (child.id === 1) {
                    continue;
                }

                const childStats = cheevs[child.id];
                if (!childStats) {
                    continue;
                }

                cheevs[category.id].have += childStats.have;
                cheevs[category.id].total += childStats.total;
                cheevs[category.id].havePoints += childStats.havePoints;
                cheevs[category.id].totalPoints += childStats.totalPoints;
            }
        }

        all.sort();
        all.reverse();

        console.timeEnd('DataUserAchievements._derivedStats');

        return {
            categories: cheevs,
            recent: all.slice(0, 100).map(([, id]) => id),
        };
    });
}
