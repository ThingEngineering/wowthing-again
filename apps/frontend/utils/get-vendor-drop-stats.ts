import every from 'lodash/every'

import userHasDrop from './user-has-drop'
import type { UserTransmogData } from '@/types/data'
import type { ManualData, ManualDataZoneMapDrop } from '@/types/data/manual'
import type { UserData } from '@/types'
import { RewardType } from '@/types/enums'


export function getVendorDropStats(
    manualData: ManualData,
    userData: UserData,
    userTransmogData: UserTransmogData,
    masochist: boolean,
    drop: ManualDataZoneMapDrop
): [number, number] {
    let have = 0
    let total = 0
    const seen: Record<number, boolean> = {}

    for (const vendorItem of drop.vendorItems) {
        const hasDrop = userHasDrop(
            manualData,
            userData,
            userTransmogData,
            vendorItem.type,
            vendorItem.id,
            vendorItem.appearanceIds
        )
        
        total++
        if (hasDrop) {
            have++
        }
    }

    /*for (const appearanceIds of drop.appearanceIds) {
        if (!masochist) {
            if (every(appearanceIds, (appearanceId) => seen[appearanceId] === true)) {
                continue
            }
            for (const appearanceId of appearanceIds) {
                seen[appearanceId] = true
            }
        }

        if (every(appearanceIds, (appearanceId) => userTransmogData.userHas[appearanceId])) {
            have++
        }

        total++
    }*/

    return [have, total]
}
