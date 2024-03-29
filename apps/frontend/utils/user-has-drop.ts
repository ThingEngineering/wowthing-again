import every from 'lodash/every'
import some from 'lodash/some'

import { transmogTypes } from '@/data/transmog'
import { RewardType } from '@/enums/reward-type'
import type { UserQuestData } from '@/types/data'
import type { ItemData } from '@/types/data/item'
import type { ManualData } from '@/types/data/manual'
import type { UserData } from '@/types/user-data'


export default function userHasDrop(
    itemData: ItemData,
    manualData: ManualData,
    userData: UserData,
    userQuestData: UserQuestData,
    type: RewardType,
    id: number,
    appearanceIds?: number[]
): boolean {
    if (
        (type === RewardType.Mount && userData.hasMount[id] === true) ||
        (type === RewardType.Pet && userData.hasPet[id] === true) ||
        (type === RewardType.Toy && userData.hasToy[id] === true) ||
        (type === RewardType.Illusion && userData.hasIllusion.has(appearanceIds[0]))
    ) {
        return true
    }
    else if (type === RewardType.Item) {
        if (manualData.dragonridingItemToQuest[id]) {
            return userQuestData.accountHas.has(manualData.dragonridingItemToQuest[id])
        }
        else if (manualData.druidFormItemToQuest[id]) {
            return userQuestData.accountHas.has(manualData.druidFormItemToQuest[id])
        }
    }
    else if (type === RewardType.AccountTrackingQuest) {
        const questIds = itemData.completesQuest[id] || []
        return some(
            questIds,
            (questId) => userQuestData.accountHas?.has(questId) || some(
                Object.values(userQuestData.characters),
                (charData) => charData?.dailyQuests?.has(questId) ||
                    charData?.quests?.has(questId)
            )
        )
    }
    else if (transmogTypes.has(type)) {
        if (appearanceIds?.[0] > 0) {
            return every(
                appearanceIds,
                (appearanceId) => userData.hasAppearance.has(appearanceId)
            )
        }
        else {
            const appearanceId = itemData.items[id]?.appearances?.[0]?.appearanceId || 0
            return userData.hasAppearance.has(appearanceId)
        }
    }

    return false
}
