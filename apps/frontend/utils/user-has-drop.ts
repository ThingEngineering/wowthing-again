import every from 'lodash/every'

import { transmogTypes } from '@/data/transmog'
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

    if (type === RewardType.Illusion && userTransmogData.hasIllusion.has(appearanceIds[0])) {
        return true
    }

    if (transmogTypes.indexOf(type) >= 0) {
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
