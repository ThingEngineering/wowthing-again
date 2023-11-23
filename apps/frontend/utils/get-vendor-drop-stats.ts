import userHasDrop from './user-has-drop'
import type { UserData } from '@/types'
import type { UserQuestData, UserTransmogData } from '@/types/data'
import type { ItemData } from '@/types/data/item'
import type { ManualData, ManualDataZoneMapDrop } from '@/types/data/manual'


export function getVendorDropStats(
    itemData: ItemData,
    manualData: ManualData,
    userData: UserData,
    userQuestData: UserQuestData,
    userTransmogData: UserTransmogData,
    masochist: boolean,
    drop: ManualDataZoneMapDrop
): [number, number] {
    let have = 0
    let total = 0
    //const seen: Record<number, boolean> = {}

    for (const vendorItem of drop.vendorItems) {
        const hasDrop = userHasDrop(
            itemData,
            manualData,
            userData,
            userQuestData,
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
