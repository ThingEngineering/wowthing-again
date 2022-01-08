import filter from 'lodash/filter'
import some from 'lodash/some'

import type {
    Character,
    StaticDataProgressCategory,
    StaticDataProgressData,
    StaticDataProgressGroup,
    UserAchievementData,
} from '@/types'
import { covenantMap } from '@/data/covenant'
import { factionIdMap } from '@/data/faction'
import type { UserQuestData } from '@/types/data'
import { classIdToSlug } from '@/data/character-class'
import { ProgressDataType } from '@/types/enums'

export default function getProgress(
    userAchievementData: UserAchievementData,
    userQuestData: UserQuestData,
    character: Character,
    category: StaticDataProgressCategory,
    group: StaticDataProgressGroup
): ProgressInfo {
    const haveIndexes: number[] = []
    let have = 0
    let total = 0
    let icon = ''

    let datas: StaticDataProgressData[]


    if (
        category.requiredQuestIds.length === 0 ||
        some(
            category.requiredQuestIds,
            (questId) => userQuestData.characters[character.id]?.quests?.has(questId)
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
                else if (group.type === 'mixed') {
                    switch (data.type) {
                        case ProgressDataType.Achievement: {
                            haveThis = userAchievementData?.achievements[data.ids[0]] > 0
                            break
                        }
                        case ProgressDataType.Criteria: {
                            const criteria = filter(
                                userAchievementData?.criteria[data.ids[0]] || [],
                                ([characterId,]) => characterId === character.id
                            )
                            haveThis = (criteria.length === 1 && criteria[0][1] >= data.value)
                            break
                        }
                        case ProgressDataType.Quest: {
                            haveThis = checkCharacterQuestIds(userQuestData, character.id, data.ids)
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

    return { datas, have, haveIndexes, icon, total }
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

interface ProgressInfo {
    datas: StaticDataProgressData[]
    have: number
    haveIndexes: number[]
    icon: string
    total: number
}
