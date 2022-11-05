import values from 'lodash/values'
import { get } from 'svelte/store'

import { UserAchievementDataCategory, WritableFancyStore } from '@/types'
import type { AchievementsState } from '@/stores/local-storage'
import type { AchievementData, UserAchievementData } from '@/types'


export class UserAchievementDataStore extends WritableFancyStore<UserAchievementData> {
    get dataUrl(): string {
        let url = document.getElementById('app')?.getAttribute('data-user')
        if (url) {
            url = url.replace(/\/(?:public|private)/, '/achievements')
        }
        return url
    }

    initialize(data: UserAchievementData): void {
        data.criteria = {}
        for (const [criteriaId, ...criteriaArrays] of data.rawCriteria) {
            data.criteria[criteriaId] = []
            for (const [amount, ...characterIds] of criteriaArrays) {
                for (const characterId of characterIds) {
                    data.criteria[criteriaId].push([characterId, amount])
                }
            }
        }
        data.rawCriteria = null
    }

    setup(
        achievementState: AchievementsState,
        achievementData: AchievementData
    ): void {
        // console.time('UserAchievementDataStore.setup')

        const userAchievements = this.value.data.achievements

        const categories = achievementData.categories
        const keepIds: Record<number, boolean> = {}
        for (const category of categories) {
            if (category === null) {
                continue
            }

            if (category.name !== 'Feats of Strength' && category.name !== 'Legacy') {
                keepIds[category.id] = true
                for (const child of category.children.filter((child) => child !== null)) {
                    keepIds[child.id] = true
                }
            }
        }

        const cheevs: Record<number, UserAchievementDataCategory> = {}
        cheevs[0] = new UserAchievementDataCategory(0, 0, 0)

        const all: [number, number][] = []
        for (const achievement of values(achievementData.achievement)) {
            if (
                (achievement.faction === 1 && !achievementState.showHorde) ||
                (achievement.faction === 0 && !achievementState.showAlliance)
            ) {
                console.log('skip', achievement)
                continue
            }

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

        for (const category of achievementData.categories.filter((cat) => cat !== null)) {
            if (!cheevs[category.id]) {
                cheevs[category.id] = new UserAchievementDataCategory(0, 0, 0)
            }

            for (const child of category.children.filter((child) => child !== null)) {
                // Statistics
                if (child.id === 1) {
                    continue
                }

                const childStats = cheevs[child.id]
                if (!childStats) {
                    continue
                }

                cheevs[category.id].have += childStats.have
                cheevs[category.id].points += childStats.points
                cheevs[category.id].total += childStats.total
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
