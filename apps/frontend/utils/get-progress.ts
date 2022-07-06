import filter from 'lodash/filter'
import some from 'lodash/some'

import { toNiceNumber } from './to-nice'
import { classIdToSlug } from '@/data/character-class'
import { covenantMap } from '@/data/covenant'
import { factionIdMap } from '@/data/faction'
import { garrisonTrees } from '@/data/garrison'
import { ProgressDataType } from '@/types/enums'
import type { Character, UserAchievementData, UserData } from '@/types'
import type { UserQuestData } from '@/types/data'
import type { StaticDataProgressCategory, StaticDataProgressData, StaticDataProgressGroup } from '@/types/data/static'


export default function getProgress(
    userData: UserData,
    userAchievementData: UserAchievementData,
    userQuestData: UserQuestData,
    character: Character,
    category: StaticDataProgressCategory,
    group: StaticDataProgressGroup
): ProgressInfo {
    let have = 0
    let showCurrency = 0
    const showReputation = 0
    let total = 0
    let icon = ''

    let datas: StaticDataProgressData[]
    const descriptionText: Record<number, string> = {}
    const haveIndexes: number[] = []

    if (
        character.level >= (category.minimumLevel ?? 0)
        &&
        (
            category.requiredQuestIds.length === 0 ||
            some(
                category.requiredQuestIds,
                (questId) => userQuestData.characters[character.id]?.quests?.has(questId)
            )
        )
    ) {
        switch (group.lookup) {
            case 'class':
                //(c) => some(drop.limit.slice(1), (cl) => classSlugMap[cl].id === c.classId)
                datas = group.data[classIdToSlug[character.classId]]
                break

            case 'covenant':
                datas = group.data[character.shadowlands?.covenantId]
                if (datas) {
                    icon = covenantMap[character.shadowlands.covenantId].icon
                }
                break

            case 'faction':
                datas = group.data[factionIdMap[character.faction]]
                break

            default:
                datas = group.data[0]
                break
        }

        if (datas) {
            total = datas.length
            for (let dataIndex = 0; dataIndex < datas.length; dataIndex++) {
                const data = datas[dataIndex]
                let haveThis = false

                if (
                    (group.type === 'quest' && checkCharacterQuestIds(userQuestData, character.id, data.ids)) ||
                    (group.type === 'accountQuest' && checkAccountQuestIds(userQuestData, data.ids))
                ) {
                    haveThis = true
                }
                else if (group.type === 'item') {
                      haveThis = some(
                        data.ids,
                        (id) => (userData.characterMap[character.id].progressItems || []).indexOf(id) >= 0
                    )
                }
                else if (group.type === 'mixed') {
                    switch (data.type) {
                        case ProgressDataType.Achievement: {
                            haveThis = userAchievementData?.achievements[data.ids[0]] > 0
                            break
                        }

                        case ProgressDataType.AddonAchievement: {
                            const cheev = userAchievementData?.addonAchievements?.[character.id]?.[data.ids[0]]
                            if (cheev) {
                                if (cheev.earned) {
                                    haveThis = true
                                }
                                else if (data.ids.length === 2) {
                                    haveThis = cheev.criteria[data.ids[1]] >= (data.value || 1)
                                }
                                else if (data.description && data.value) {
                                    // TODO do this properly
                                    let have = 0
                                    if (data.ids[0] === 11160) {
                                        have = (cheev.criteria || []).reduce((a, b) => a + Math.min(1, b), 0)
                                    }
                                    else {
                                        have = (cheev.criteria || []).reduce((a, b) => a + b, 0)
                                    }

                                    descriptionText[dataIndex] = data.description
                                        .replace('%1', have.toString())
                                        .replace('%2', data.value.toString())
                                }
                            }
                            break
                        }

                        case ProgressDataType.Criteria: {
                            const criteria = filter(
                                userAchievementData?.criteria[data.ids[0]] || [],
                                ([characterId,]) => characterId === character.id
                            )
                            haveThis = (criteria.length === 1 && criteria[0][1] >= (data.value || 1))
                            break
                        }

                        case ProgressDataType.Quest: {
                            haveThis = checkCharacterQuestIds(userQuestData, character.id, data.ids)
                            break
                        }

                        case ProgressDataType.SpentCyphers: {
                            showCurrency = 1979 // Cyphers of the First Ones
                            const spent = getSpentCyphers(character)
                            haveThis = spent >= (data.value || 0)
                            if (!haveThis) {
                                descriptionText[dataIndex] = `${toNiceNumber(spent)} / ${toNiceNumber(data.value)}`
                            }
                            break
                        }
                    }
                }

                if (haveThis) {
                    haveIndexes.push(dataIndex)
                    have++
                }
            }
        }
    }

    return {
        datas,
        descriptionText,
        have,
        haveIndexes,
        icon,
        showCurrency,
        showReputation,
        total,
    }
}

function checkAccountQuestIds(userQuestData: UserQuestData, questIds: number[]) {
    return some(
        userQuestData.characters,
        (char) => some(questIds, (id) => char.quests?.has(id))
    )
}

function checkCharacterQuestIds(userQuestData: UserQuestData, characterId: number, questIds: number[]) {
    return some(
        questIds,
        (id) => userQuestData.characters[characterId]?.quests?.has(id)
    )
}

function getSpentCyphers(character: Character): number {
    const characterTree = character.garrisonTrees?.[garrisonTrees.cypherResearch.id]
    if (characterTree) {
        let total = 0
        for (const tier of garrisonTrees.cypherResearch.tiers) {
            for (const talent of tier) {
                if (talent === null) {
                    continue
                }

                const rank = characterTree[talent.id][0]
                for (let i = 0; i < rank; i++) {
                    total += talent.costs[i]
                }
            }
        }
        return total
    }
    return 0
}

export interface ProgressInfo {
    datas: StaticDataProgressData[]
    descriptionText: Record<number, string>
    have: number
    haveIndexes: number[]
    icon: string
    showCurrency: number
    showReputation: number
    total: number
}
