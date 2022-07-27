import every from 'lodash/every'

import type { UserTransmogData } from '@/types/data'
import type { ManualDataZoneMapDrop } from '@/types/data/manual'


export function getVendorDropStats(
    userTransmogData: UserTransmogData,
    masochist: boolean,
    drop: ManualDataZoneMapDrop
): [number, number] {
    let have = 0
    let total = 0
    const seen: Record<number, boolean> = {}

    for (const appearanceIds of drop.appearanceIds) {
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
    }

    return [have, total]
}
