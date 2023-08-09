import find from 'lodash/find'
import some from 'lodash/some'

import { toNiceNumber } from '@/utils/formatting'
import { covenantFeatureOrder, covenantMap } from '@/data/covenant'
import { factionIdMap } from '@/data/faction'
import { garrisonBuildingIcon, garrisonTrees, garrisonUnlockQuests } from '@/data/garrison'
import { ProgressDataType, QuestStatus } from '@/enums'
import type { Character, CharacterShadowlandsCovenant, CharacterShadowlandsCovenantFeature, UserAchievementData, UserData } from '@/types'
import type { UserQuestData } from '@/types/data'
import type { ManualDataProgressCategory, ManualDataProgressData, ManualDataProgressGroup } from '@/types/data/manual'
import type { StaticData } from '@/types/data/static'

export default function getProgress(
    staticData: StaticData,
    userData: UserData,
    userAchievementData: UserAchievementData,
    userQuestData: UserQuestData,
    character: Character,
    category: ManualDataProgressCategory,
    group: ManualDataProgressGroup
): ProgressInfo {
    let have = 0
    let missingRequired = false
    let showCurrency = 0
    let total = 0
    let icon = ''
    const showReputation = 0

    let datas: ManualDataProgressData[]
    const descriptionText: Record<number, string> = {}
    const haveIndexes: number[] = []
    const nameOverride: Record<number, string> = {}

    if (
        character.level >= (category.minimumLevel || 0) &&
        character.level >= (group.minimumLevel || 0) &&
        (
            category.requiredQuestIds.length === 0 ||
            some(
                category.requiredQuestIds,
                (questId) => userQuestData.characters[character.id]?.quests?.has(questId)
            )
        ) &&
        (
            (group.requiredQuestIds?.length || 0) === 0 ||
            some(
                group.requiredQuestIds,
                (questId) => userQuestData.characters[character.id]?.quests?.has(questId)
            )
        )
    ) {
        switch (group.lookup) {
            case 'class':
                //(c) => some(drop.limit.slice(1), (cl) => classSlugMap[cl].id === c.classId)
                datas = group.data[staticData.characterClasses[character.classId].slug]
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
            if (datas[0].type === ProgressDataType.GarrisonTree) {
                total = datas.reduce((a, b) => a + b.value, 0)
            }
            else {
                total = datas.filter((data) => data.name !== 'separator').length
            }

            for (let dataIndex = 0; dataIndex < datas.length; dataIndex++) {
                const data = datas[dataIndex]
                if (data.name === 'separator') {
                    continue
                }

                let haveThis = false
                if (
                    (group.type === 'quest' && checkCharacterQuestIds(userQuestData, character.id, data.ids)) ||
                    (group.type === 'accountQuest' && checkAccountQuestIds(userQuestData, data.ids))
                ) {
                    haveThis = true

                    if (group.name === 'Brewfest Intro Quests') {
                        showCurrency = 1037829 // Cyphers of the First Ones
                    }
                }
                else if (group.type === 'item') {
                      haveThis = some(
                        data.ids,
                        (id) => character.getItemCount(id) > 0
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
                                    haveThis = (cheev.criteria?.[data.ids[1]] || 0) >= (data.value || 1)
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
                            else if (data.description && data.value) {
                                descriptionText[dataIndex] = data.description
                                    .replace('%1', have.toString())
                                    .replace('%2', data.value.toString())
                            }
                            break
                        }

                        case ProgressDataType.Always: {
                            haveThis = true
                            break
                        }

                        case ProgressDataType.Criteria: {
                            const criteria = (userAchievementData?.criteria[data.ids[0]] || [])
                                .filter(([characterId,]) => characterId === character.id)
                            haveThis = (criteria.length === 1 && criteria[0][1] >= (data.value || 1))
                            break
                        }

                        case ProgressDataType.HonorLevel: {
                            haveThis = userData.honorLevel >= data.value
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

                        case ProgressDataType.AddonQuest: {
                            const quest = userQuestData.characters[character.id]?.progressQuests?.[data.value]
                            if (quest) {
                                haveThis = quest.status === QuestStatus.Completed
                                have = haveThis
                                    ? total - 1
                                    : quest.objectives.reduce((a, b) => a + b.have, 0)
                            }
                            break
                        }

                        case ProgressDataType.GarrisonTree: {
                            const talent = character.garrisonTrees?.[data.ids[0]]?.[data.ids[1]]
                            if (talent?.[0] > 0) {
                                have += (data.value - 1)
                                haveThis = talent[0] >= data.value
                            }

                            descriptionText[dataIndex] = `Rank ${talent?.[0] || 0}/${data.value}`
                            showCurrency = 1904 // Tower Knowledge

                            break
                        }

                        case ProgressDataType.SlCovenant: {
                            const covenant = character.shadowlands?.covenants?.[
                                data.ids[0] === 0 ? character.shadowlands?.covenantId : data.ids[0]
                            ]
                            if (covenant && (
                                    covenant.conductor?.rank > 0 ||
                                    covenant.missions?.rank > 0 ||
                                    covenant.transport?.rank > 0 ||
                                    covenant.unique?.rank > 0
                            )) {
                                const [featureKey, , featureMaxRank] = covenantFeatureOrder[data.value - 1]
                                const charBuilding = covenant[featureKey as keyof CharacterShadowlandsCovenant] as CharacterShadowlandsCovenantFeature

                                if (data.ids[0] === 0) {
                                    icon = covenantMap[character.shadowlands.covenantId].icon
                                }

                                have = charBuilding?.rank || 0

                                if (charBuilding?.researchEnds > 0) {
                                    // const ends: DateTime = DateTime.fromSeconds(charBuilding.researchEnds)
                                    // if (ends <= now) {
                                    have++
                                    // }
                                    // else {
                                    //     const duration = toNiceDuration(ends.diff($timeStore).toMillis())
                                    //     return `${feature.rank + 1} in<br><span class="status-shrug">${duration}</span>`
                                    // }
                                }
                        
                                total = featureMaxRank
                                descriptionText[dataIndex] = `Rank ${have}/${total}`
                            }
                            else {
                                have = -1
                                total = -1
                            }
                            break
                        }

                        case ProgressDataType.WodGarrison: {
                            const garrison = character.garrisons?.[2]

                            // Garrison level
                            if (data.value === undefined) {
                                if (garrison?.level > 0) {
                                    have = garrison.level
                                    total = 3
                                }
                                else {
                                    if (some(
                                        garrisonUnlockQuests,
                                        (questId) => userQuestData.characters[character.id].quests?.has(questId)
                                    )) {
                                        total = 3
                                    }
                                    else {
                                        have = -1
                                        total = 0
                                    }
                                }
                            }
                            else if (garrison) {
                                const building = find(
                                    garrison.buildings,
                                    (building) => building.plotId === data.ids[0]
                                )

                                if (building) {
                                    have = building.rank
                                    total = 3
                                    descriptionText[dataIndex] = `Rank ${have}`
                                    icon = garrisonBuildingIcon[building.buildingId]
                                    nameOverride[dataIndex] = building.name
                                }
                                else {
                                    if (garrison.level >= data.value) {
                                        have = -1
                                    }
                                    total = 0
                                }
                            }
                            else {
                                total = 0
                            }
                        }
                    }
                }

                if (haveThis) {
                    haveIndexes.push(dataIndex)
                    have++
                }
                else if (!haveThis && data.required === true) {
                    missingRequired = true
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
        missingRequired,
        nameOverride,
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

                const rank = characterTree[talent.id]?.[0] || 0
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
    datas: ManualDataProgressData[]
    descriptionText: Record<number, string>
    have: number
    haveIndexes: number[]
    icon: string
    missingRequired: boolean
    nameOverride: Record<number, string>
    showCurrency: number
    showReputation: number
    total: number
}
