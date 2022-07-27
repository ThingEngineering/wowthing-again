import every from 'lodash/every'

import { RewardType } from '@/types/enums'
import type { ManualData } from '@/types/data/manual'
import type { UserData } from '@/types/user-data'
import type { UserTransmogData } from '@/types/data'
import { transmogTypes } from '@/stores/user-vendors'


export default function userHasDrop(
    manualData: ManualData,
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
            const appearanceId = manualData.shared.items[id]?.appearanceIds?.[0] || 0
            return userTransmogData.userHas[appearanceId] === true
        }
            
    }

    return false
}
