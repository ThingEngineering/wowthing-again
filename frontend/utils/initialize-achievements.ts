import values from 'lodash/values'
import { get } from 'svelte/store'

import { achievementStore, userStore } from '@/stores'
import type {Dictionary} from '@/types'
import {UserDataAchievementCategory} from '@/types'


export function initializeAchievements(): void {
    const userAchievements = get(userStore).data.achievements

    const categories = get(achievementStore).data.categories
    const keepIds: Dictionary<boolean> = {}
    for (const category of categories) {
        if (category.name !== 'Feats of Strength' && category.name !== 'Legacy') {
            keepIds[category.id] = true
            for (const child of category.children) {
                keepIds[child.id] = true
            }
        }
    }

    const cheevs: Dictionary<UserDataAchievementCategory> = {}
    cheevs[0] = new UserDataAchievementCategory(0, 0, 0)

    const all: [number, number][] = []
    for (const achievement of values(get(achievementStore).data.achievements)) {
        if (!cheevs[achievement.categoryId]) {
            cheevs[achievement.categoryId] = new UserDataAchievementCategory(0, 0, 0)
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
            cheevs[category.id] = new UserDataAchievementCategory(0, 0, 0)
        }
        
        for (const child of category.children) {
            cheevs[category.id].have += cheevs[child.id].have
            cheevs[category.id].points += cheevs[child.id].points
            cheevs[category.id].total += cheevs[child.id].total
        }
    }

    all.sort()
    all.reverse()
    userStore.update(state => {
        state.data.achievementCategories = cheevs
        state.data.achievementRecent = all.slice(0, 5).map(([, id]) => id)
        return state
    })
}
