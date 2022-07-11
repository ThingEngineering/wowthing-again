import values from 'lodash/values'
import { get } from 'svelte/store'

import { UserAchievementDataCategory, WritableFancyStore } from '@/types'
import type { AchievementData, UserAchievementData } from '@/types'


export class UserAchievementDataStore extends WritableFancyStore<UserAchievementData> {
    get dataUrl(): string {
        let url = document.getElementById('app')?.getAttribute('data-user')
        if (url) {
            url += '/achievements'
        }
        return url
    }

    setup(
        achievementData: AchievementData
    ): void {
        // console.time('UserAchievementDataStore.setup')

        const userAchievements = get(this).data.achievements

        const categories = achievementData.categories
        const keepIds: Record<number, boolean> = {}
        for (const category of categories) {
            if (category.name !== 'Feats of Strength' && category.name !== 'Legacy') {
                keepIds[category.id] = true
                for (const child of category.children) {
                    keepIds[child.id] = true
                }
            }
        }

        const cheevs: Record<number, UserAchievementDataCategory> = {}
        cheevs[0] = new UserAchievementDataCategory(0, 0, 0)

        const all: [number, number][] = []
        for (const achievement of values(achievementData.achievement)) {
            if (!cheevs[achievement.categoryId]) {
                cheevs[achievement.categoryId] = new UserAchievementDataCategory(0, 0, 0)
            }

            cheevs[achievement.categoryId].total++

            if (keepIds[achievement.categoryId]) {
                cheevs[0].total++
            }

            if (userAchievements[achievement.id]) {
                all.push([userAchievements[achievement.id], achievement.id])

                cheevs[achievement.categoryId].have++
                cheevs[achievement.categoryId].points += achievement.points

                if (keepIds[achievement.categoryId]) {
                    cheevs[0].have++
                    cheevs[0].points += achievement.points
                }
            }
        }

        for (const category of achievementData.categories) {
            if (!cheevs[category.id]) {
                cheevs[category.id] = new UserAchievementDataCategory(0, 0, 0)
            }

            for (const child of category.children) {
                // Statistics
                if (child.id === 1) {
                    continue
                }

                cheevs[category.id].have += cheevs[child.id].have
                cheevs[category.id].points += cheevs[child.id].points
                cheevs[category.id].total += cheevs[child.id].total
            }
        }

        all.sort()
        all.reverse()

        this.update(state => {
            state.data.achievementCategories = cheevs
            state.data.achievementRecent = all.slice(0, 10).map(([, id]) => id)
            return state
        })

        // console.timeEnd('UserAchievementDataStore.setup')
    }
}

export const userAchievementStore = new UserAchievementDataStore()
