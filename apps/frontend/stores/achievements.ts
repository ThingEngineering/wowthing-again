import find from 'lodash/find'

import { extraCategories, forceSupersededBy, forceSupersedes } from '@/data/achievements'
import {
    AchievementDataAchievement,
    AchievementDataCriteria,
    AchievementDataCriteriaTree,
    WritableFancyStore,
    type AchievementDataCategory
} from '@/types'
import type { AchievementData } from '@/types'


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

        data.categories.push(null)
        data.categories.push({
            id: categoryId,
            name: 'Back from the Beyond',
            slug: 'back-from-the-beyond',
            achievementIds: [
                15654, // Back from the Beyond

                14715, // Castle Nathria
                14961, // Chains of Domination
                15647, // Dead Men Tell Some Tales
                15178, // Fake It 'Til You Make It
                
                15336, // From A to Zereth
                15331, // Treasures of Zereth Mortis
                15392, // Dune Dominance
                15391, // Adventurer of Zereth Mortis
                15402, // Cyphers of the First Ones
                15407, // Synthe-fived!
                15220, // The Enlightened

                15079, // Many, Many Things
                15651, // Myths of the Shadowland Dungeons

                15035, // On the Offensive

                15646, // Re-Re-Re-Renowned
                15025, // Sanctum Superior
                15126, // Sanctum of Domination
                15259, // Secrets of the First Ones
                15417, // Sepulcher of the First Ones

                15649, // Shadowlands Dilettante
                14502, // Pursuing Loyalty
                14723, // Be Our Guest
                14752, // Things To Do When You're Dead
                14684, // Abominable Lives
                14751, // The Gang's All Here
                14748, // Wardrobe Makeover
                14753, // It's a Wrap
                14775, // Mush Appreciated

                15324, // Tower Ranger
                15322, // Flawless Master (Layer 16)
                15092, // Master of Torment
                15093, // Avenge Me!
                15095, // No Doubt
                15094, // Rampage
                15096, // Crowd Pleaser

                15648, // Walking in Maw-mphis
                14895, // 'Ghast Five
                14744, // Better to Be Lucky Than Dead
                14660, // It's About Sending a Message
                14738, // Hunting Party
                14656, // Trading Partners
                14658, // Soulkeeper's Burden
                14663, // Explore The Maw
            ],
            children: [],
        })

        console.timeEnd('AchievementData.initialize')
    }
}

export const achievementStore = new AchievementDataStore()
