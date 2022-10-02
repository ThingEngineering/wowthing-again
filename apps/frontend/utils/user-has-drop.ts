import every from 'lodash/every'

import { transmogTypes } from '@/stores/user-vendors'
import { RewardType } from '@/enums'
import type { UserTransmogData } from '@/types/data'
import type { ItemData } from '@/types/data/item'
import type { UserData } from '@/types/user-data'


export default function userHasDrop(
    itemData: ItemData,
    userData: UserData,
    userTransmogData: UserTransmogData,
    type: RewardType,
    id: number,
    appearanceIds?: number[]
): boolean {
    if (type === RewardType.Mount && userData.hasMount[id] === true) {
        return true
    }

    if (type === RewardType.Pet && userData.hasPet[id] === true) {
        return true
    }

    if (type === RewardType.Toy && userData.hasToy[id] === true) {
        return true
    }

    if (type === RewardType.Illusion && userTransmogData.hasIllusion[appearanceIds[0]]) {
        return true
    }

    if (transmogTypes.indexOf(type) >= 0) {
        if (appearanceIds) {
            return every(
                appearanceIds,
                (appearanceId) => userTransmogData.userHas[appearanceId] === true
            )
        }
        else {
            const appearanceId = itemData.items[id]?.appearances?.[0]?.appearanceId || 0
            return userTransmogData.userHas[appearanceId] === true
        }
            
    }

    return false
}
