import { get } from 'svelte/store';

import { userModifiedStore } from './user-modified';
import { WritableFancyStore } from '@/types/fancy-store';
import {
    UserAchievementDataCategory,
    type UserAchievementData,
} from '@/types/user-achievement-data';
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
import type { AchievementsState } from '@/stores/local-storage';
import type { AchievementData } from '@/types/achievement-data';

export class UserAchievementDataStore extends WritableFancyStore<UserAchievementData> {
    get dataUrl(): string {
        let url = document.getElementById('app')?.getAttribute('data-user');
        if (url) {
            const modified = get(userModifiedStore).achievements;
            url = url.replace(/\/(?:public|private).+$/, `/achievements-${modified}.json`);
        }
        return url;
    }

    initialize(data: UserAchievementData): void {
        console.time('UserAchievementDataStore.initialize');

        data.criteria = {};
        for (const criteriaData of data.rawCriteria) {
            const baseArray: number[][] = (data.criteria[criteriaData[0]] = []);
            for (let i = 1; i < criteriaData.length; i++) {
                const sigh = criteriaData[i] as number[];
                for (let j = 1; j < sigh.length; j++) {
                    baseArray.push([sigh[j], sigh[0]]);
                }
            }
        }
        data.rawCriteria = null;

        // { characterId: { achievementId: data, ... } }
        for (const characterAchievements of Object.values(data.addonAchievements)) {
            for (const [achievementId, addonData] of getNumberKeyedEntries(characterAchievements)) {
                if (addonData.earned) {
                    data.achievements[achievementId] = 1;
                }
            }
        }

        console.timeEnd('UserAchievementDataStore.initialize');
    }

    setup(achievementState: AchievementsState, achievementData: AchievementData): void {
        console.time('UserAchievementDataStore.setup');

        const userAchievements = this.value.achievements;

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
        for (const achievement of Object.values(achievementData.achievement)) {
            if (
                (achievement.faction === 1 && !achievementState.showHorde) ||
                (achievement.faction === 0 && !achievementState.showAlliance) ||
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
                    cheevs[categoryId] = new UserAchievementDataCategory(0, 0, 0, 0)
                }

                cheevs[categoryId].total++
                cheevs[categoryId].totalPoints += achievement.points

                if (keepIds[categoryId]) {
                    cheevs[0].total++
                    cheevs[0].totalPoints += achievement.points
                }

                if (userAchievements[achievement.id]) {
                    all.push([userAchievements[achievement.id], achievement.id])

                    cheevs[categoryId].have++
                    cheevs[categoryId].havePoints += achievement.points

                    if (keepIds[categoryId]) {
                        cheevs[0].have++
                        cheevs[0].havePoints += achievement.points
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

        this.update((state) => {
            state.achievementCategories = cheevs;
            state.achievementRecent = all.slice(0, 10).map(([, id]) => id);
            return state;
        });

        console.timeEnd('UserAchievementDataStore.setup');
    }
}

export const userAchievementStore = new UserAchievementDataStore();
