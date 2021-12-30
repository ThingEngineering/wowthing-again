import some from 'lodash/some'

import type { Character, StaticDataProgressCategory, StaticDataProgressData, StaticDataProgressGroup } from '@/types'
import { covenantMap } from '@/data/covenant'
import { factionIdMap } from '@/data/faction'
import type { UserQuestData } from '@/types/data'
import { classIdToSlug } from '@/data/character-class'

export default function getProgress(
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
                if (
                    (
                        group.type === 'quest' &&
                        some(data.ids, (id) => userQuestData.characters[character.id]?.quests?.has(id))
                    ) || (
                        group.type === 'accountQuest' &&
                        some(
                            userQuestData.characters,
                            (char) => some(data.ids, (id) => char.quests?.has(id))
                        )
                    )
                ) {
                    haveIndexes.push(dataIndex)
                    have++
                }
            }
        }
    }

    return { datas, have, haveIndexes, icon, total }
}

interface ProgressInfo {
    datas: StaticDataProgressData[]
    have: number
    haveIndexes: number[]
    icon: string
    total: number
}
