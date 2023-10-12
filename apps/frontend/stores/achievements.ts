import find from 'lodash/find'

import { extraCategories, forceSupersededBy, forceSupersedes } from '@/data/achievements'
import {
    AchievementDataAchievement,
    AchievementDataCriteria,
    AchievementDataCriteriaTree,
    type AchievementDataCategory
} from '@/types/achievement-data'
import type { AchievementData } from '@/types/achievement-data'
import { WritableFancyStore } from '@/types/fancy-store'


export class AchievementDataStore extends WritableFancyStore<AchievementData> {
    get dataUrl(): string {
        return document.getElementById('app')?.getAttribute('data-achievements')
    }
    
    initialize(data: AchievementData): void {
        console.time('AchievementData.initialize')

        data.achievement = {}
        for (const rawAchievement of data.achievementRaw) {
            const obj = new AchievementDataAchievement(...rawAchievement)

            if (forceSupersedes[obj.id]) {
                obj.supersedes = forceSupersedes[obj.id]
            }
            if (forceSupersededBy[obj.id]) {
                obj.supersededBy = forceSupersededBy[obj.id]
            }

            data.achievement[obj.id] = obj
        }
        data.achievementRaw = null

        data.criteria = {}
        for (const rawCriteria of data.criteriaRaw) {
            const obj = new AchievementDataCriteria(...rawCriteria)
            data.criteria[obj.id] = obj
        }
        data.criteriaRaw = null

        data.criteriaTree = {}
        for (const rawCriteriaTree of data.criteriaTreeRaw) {
            const obj = new AchievementDataCriteriaTree(...rawCriteriaTree)
            data.criteriaTree[obj.id] = obj
        }
        data.criteriaTreeRaw = null

        data.isHidden = {}
        for (const achievementId of data.hideIds) {
            data.isHidden[achievementId] = true
        }
        data.hideIds = null

        data.categories.push(null)
        let categoryId = 100000
        for (const [baseSlug, children] of extraCategories) {
            const slugCat = find(data.categories[6].children, (c) => c.slug === baseSlug)
            if (!slugCat) {
                console.log('uh oh', baseSlug)
                continue
            }

            const category: AchievementDataCategory = {
                id: categoryId++,
                name: slugCat.name,
                slug: slugCat.slug,
                achievementIds: [],
                children: [],
            }

            for (const child of children) {
                if (child === null) {
                    category.children.push(null)
                    continue
                }
                
                const [childSlug, childNameType, childSlugOverride, childNameOverride] = child
                
                const [childSlug1, childSlug2] = childSlug.split('/')
                const childCat1 = find(data.categories, (c) => c !== null && c.slug === childSlug1)
                const childCat2 = find(childCat1?.children || [], (c) => c.slug === childSlug2)
                if (childCat2) {
                    let childName: string
                    let childSlug: string
                    if (childNameType === 1) {
                        childName = childCat1.name
                        childSlug = childCat1.slug
                    }
                    else if (childNameType === 2) {
                        childName = childCat2.name
                        childSlug = childCat2.slug
                    }
                    else if (childNameType === 3) {
                        childName = childNameOverride
                        childSlug = childSlugOverride
                    }

                    category.children.push({
                        id: childCat2.id,
                        name: childName,
                        slug: childSlug,
                        achievementIds: childCat2.achievementIds,
                        children: []
                    })
                }
                else {
                    console.log('womp womp', childSlug1, childSlug2)
                }
            }

            data.categories.push(category)
        }

        console.timeEnd('AchievementData.initialize')
    }
}

export const achievementStore = new AchievementDataStore()
