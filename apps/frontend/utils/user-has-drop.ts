import every from 'lodash/every'
import some from 'lodash/some'

import { transmogTypes } from '@/data/transmog'
import { RewardType } from '@/enums'
import type { UserQuestData, UserTransmogData } from '@/types/data'
import type { ItemData } from '@/types/data/item'
import type { UserData } from '@/types/user-data'


export default function userHasDrop(
    itemData: ItemData,
    userData: UserData,
    userQuestData: UserQuestData,
    userTransmogData: UserTransmogData,
    type: RewardType,
    id: number,
    appearanceIds?: number[]
): boolean {
    if (
        (type === RewardType.Mount && userData.hasMount[id] === true) ||
        (type === RewardType.Pet && userData.hasPet[id] === true) ||
        (type === RewardType.Toy && userData.hasToy[id] === true) ||
        (type === RewardType.Illusion && userTransmogData.hasIllusion.has(appearanceIds[0]))
    ) {
        return true
    }
    else if (type === RewardType.AccountTrackingQuest) {
        const questIds = itemData.completesQuest[id] || []
        console.log(id, questIds)
        return some(
            questIds,
            (questId) => userQuestData.accountHas?.has(questId) || some(
                Object.values(userQuestData.characters),
                (charData) => charData?.dailyQuests?.has(questId) ||
                    charData?.quests?.has(questId)
            )
        )
    }
    else if (transmogTypes.indexOf(type) >= 0) {
        if (appearanceIds?.[0] > 0) {
            return every(
                appearanceIds,
                (appearanceId) => userTransmogData.hasAppearance.has(appearanceId)
            )
        }
        else {
            const appearanceId = itemData.items[id]?.appearances?.[0]?.appearanceId || 0
            return userTransmogData.hasAppearance.has (appearanceId)
        }
            
    }

    return false
}
