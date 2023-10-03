import { forceAddonCriteria, forceGarrisonTalent } from '@/data/achievements'
import { CriteriaType } from '@/enums/criteria-type'
import type {
    AchievementData,
    AchievementDataAchievement,
    AchievementDataCriteriaTree,
    UserAchievementData,
    UserData
} from '@/types'


const debugId = 12909

export function getAccountData(
    achievementData: AchievementData,
    userAchievementData: UserAchievementData,
    userData: UserData,
    achievement: AchievementDataAchievement
): AchievementDataAccount {
    //const ctMap = get(achievementStore).criteriaTree
    //const userCrits = get(userAchievementStore).criteria

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
                else if (criteria?.type === CriteriaType.GarrisonTalentCompleteResearchAny && forceGarrisonTalent[childId]) {
                    const [talentId, minRank] = forceGarrisonTalent[childId]
                    for (const character of userData.characters) {
                        for (const garrisonTree of Object.values(character.garrisonTrees || {})) {
                            if (garrisonTree[talentId]) {
                                if (garrisonTree[talentId]?.[0] >= minRank) {
                                    ret.have[childId] = 1
                                }
                                break
                            }
                        }
                    }
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
                else if (criteria?.type === CriteriaType.HonorMaybe) {
                    console.log(criteria)
                    console.log(childTree)
                    ret.have[childId] = userData.honorLevel || 0
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

    if (achievement.id === debugId) {
        console.log('ret', ret)
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
