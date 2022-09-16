import { forceAddonCriteria } from '@/data/achievements'
import type {
    AchievementData,
    AchievementDataAchievement,
    AchievementDataCriteriaTree,
    UserAchievementData,
    UserData
} from '@/types'
import { CriteriaType } from '@/types/enums'


const debugId = 1565411

export function getAccountData(
    achievementData: AchievementData,
    userAchievementData: UserAchievementData,
    userData: UserData,
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

        //console.log(achievement.id, forcedId, userAchievementData.addonAchievements)
        //console.log(userAchievementData.addonAchievements[forcedId])
    }
    else {
        for (const childId of rootCriteriaTree?.children ?? []) {
            const childTree = achievementData.criteriaTree[childId]
            if (childTree) {
                ret.criteria.push(childTree)
                const criteria = achievementData.criteria[childTree.criteriaId]

                if (achievement.id === debugId) {
                    console.log(childTree, achievementData.criteria[childTree.criteriaId], userAchievementData.criteria[childId])
                }

                if (criteria?.type === CriteriaType.EarnAchievement) {
                    ret.have[childId] = userAchievementData.achievements[criteria.asset] !== undefined ? 1 : 0
                }
                else if (criteria?.type === CriteriaType.RaiseSkillLine) {
                    for (const character of userData.characters) {
                        for (const subProfessions of Object.values(character.professions || {})) {
                            const subProfession = subProfessions[criteria.asset]
                            if (subProfession?.currentSkill >= childTree.amount) {
                                ret.have[childId] = 1
                                break
                            }
                        }
                    }
                }
                else {
                    const value: number[] = (userAchievementData.criteria[childId] || [[]])[0]
                    ret.have[childId] = value[1] || 0

                    if (ret.have[childId] === 0) {
                        for (const childChild of childTree.children) {
                            const value: number[] = (userAchievementData.criteria[childChild] || [[]])[0]
                            ret.have[childId] = value[1] || 0
                        }
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
