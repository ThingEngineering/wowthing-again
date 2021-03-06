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

    if (type === RewardType.Toy &&userData.hasToy[id] === true) {
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
            return userTransmogData.userHas[manualData.shared.items[id]?.appearanceId] === true
        }
            
    }

    return false
}
