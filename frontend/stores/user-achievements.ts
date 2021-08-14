import values from 'lodash/values'
import { get } from 'svelte/store'

import {
    AchievementDataAchievement,
    AchievementDataCriteria,
    AchievementDataCriteriaTree,
    Dictionary,
    UserAchievementDataCategory,
    WritableFancyStore,
} from '@/types'
import type { UserAchievementData } from '@/types'
import { achievementStore } from '@/stores/achievements'


export class UserAchievementDataStore extends WritableFancyStore<UserAchievementData> {
    get dataUrl(): string {
        let url = document.getElementById('app')?.getAttribute('data-user')
        if (url) {
            url += '/achievements'
        }
        return url
    }

    setup(): void {
        console.time('setup UserAchievementDataStore')

        const achievementData = get(achievementStore).data
        if (achievementData.achievementRaw) {
            const achievementDict: Dictionary<AchievementDataAchievement> = {}
            for (const rawAchievement of achievementData.achievementRaw) {
                const obj = new AchievementDataAchievement(...rawAchievement)
                achievementDict[obj.id] = obj
            }

            const criteriaDict: Dictionary<AchievementDataCriteria> = {}
            /*for (const rawCriteria of achievementData.criteriaRaw) {
                const obj = new AchievementDataCriteria(...rawCriteria)
                criteriaDict[obj.id] = obj
            }*/

            const criteriaTreeDict: Dictionary<AchievementDataCriteriaTree> = {}
            for (const rawCriteriaTree of achievementData.criteriaTreeRaw) {
                const obj = new AchievementDataCriteriaTree(...rawCriteriaTree)
                criteriaTreeDict[obj.id] = obj
                //console.log(obj.id, rawCriteriaTree, obj)
            }

            achievementStore.update(state => {
                state.data.achievementRaw = null
                state.data.criteriaRaw = null
                state.data.criteriaTreeRaw = null

                state.data.achievement = achievementDict
                state.data.criteria = criteriaDict
                state.data.criteriaTree = criteriaTreeDict

                return state
            })
        }

        const userAchievements = get(this).data.achievements

        const categories = achievementData.categories
        const keepIds: Dictionary<boolean> = {}
        for (const category of categories) {
            if (category.name !== 'Feats of Strength' && category.name !== 'Legacy') {
                keepIds[category.id] = true
                for (const child of category.children) {
                    keepIds[child.id] = true
                }
            }
        }

        const cheevs: Dictionary<UserAchievementDataCategory> = {}
        cheevs[0] = new UserAchievementDataCategory(0, 0, 0)

        const all: [number, number][] = []
        for (const achievement of values(get(achievementStore).data.achievement)) {
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

        for (const category of get(achievementStore).data.categories) {
            if (!cheevs[category.id]) {
                cheevs[category.id] = new UserAchievementDataCategory(0, 0, 0)
            }

            for (const child of category.children) {
                cheevs[category.id].have += cheevs[child.id].have
                cheevs[category.id].points += cheevs[child.id].points
                cheevs[category.id].total += cheevs[child.id].total
            }
        }

        all.sort()
        all.reverse()

        this.update(state => {
            state.data.achievementCategories = cheevs
            state.data.achievementRecent = all.slice(0, 5).map(([, id]) => id)
            return state
        })

        console.timeEnd('setup UserAchievementDataStore')
    }
}

export const userAchievementStore = new UserAchievementDataStore()
