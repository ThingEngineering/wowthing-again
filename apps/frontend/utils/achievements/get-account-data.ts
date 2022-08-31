import { forceAddonCriteria } from '@/data/achievements'
import type {
    AchievementData,
    AchievementDataAchievement,
    AchievementDataCriteriaTree,
    UserAchievementData
} from '@/types'

export function getAccountData(
    achievementData: AchievementData,
    userAchievementData: UserAchievementData,
    achievement: AchievementDataAchievement
): AchievementDataAccount {
    //const ctMap = get(achievementStore).data.criteriaTree
    //const userCrits = get(userAchievementStore).data.criteria

    const ret = new AchievementDataAccount()

    const rootCriteriaTree = achievementData.criteriaTree[achievement.criteriaTreeId]
    const forcedId = forceAddonCriteria[achievement.id]
    if (forcedId) {
        ret.criteria.push(rootCriteriaTree)

        for (const characterAchievements of Object.values(userAchievementData.addonAchievements)) {
            const characterAchievement = characterAchievements[forcedId]
            if (characterAchievement) {
                for (let criteriaIndex = 0; criteriaIndex < characterAchievement.criteria.length; criteriaIndex++) {
                    ret.have[rootCriteriaTree.id] = characterAchievement.criteria[criteriaIndex]
                }
                console.log(characterAchievement, ret)

                break
            }
        }

        console.log(achievement.id, forcedId, userAchievementData.addonAchievements)
        console.log(userAchievementData.addonAchievements[forcedId])
    }
    else {
        for (const child of rootCriteriaTree?.children ?? []) {
            const childTree = achievementData.criteriaTree[child]
            if (childTree) {
                ret.criteria.push(childTree)

                if (achievement.id === 9451) {
                    console.log(childTree, achievementData.criteria[childTree.criteriaId], userAchievementData.criteria[child])
                }

                const value: number[] = (userAchievementData.criteria[child] || [[]])[0]
                ret.have[child] = value[1] || 0

                if (ret.have[child] === 0) {
                    for (const childChild of childTree.children) {
                        const value: number[] = (userAchievementData.criteria[childChild] || [[]])[0]
                        ret.have[child] = value[1] || 0
                    }
                }
            }
        }
    }

    if (achievement.id === 9451) {
        console.log(ret)
    }

    return ret
}

export class AchievementDataAccount {
    criteria: AchievementDataCriteriaTree[]
    have: Record<number, number>

    constructor() {
        this.criteria = []
        this.have = {}
    }
}
