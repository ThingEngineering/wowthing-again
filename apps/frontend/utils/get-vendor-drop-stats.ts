import type { Settings } from '@/shared/stores/settings/types/settings';
import type { ManualDataZoneMapDrop } from '@/types/data/manual';

import userHasDrop from './user-has-drop';

export function getVendorDropStats(
    settings: Settings,
    masochist: boolean,
    drop: ManualDataZoneMapDrop
): [number, number] {
    let have = 0;
    let total = 0;
    //const seen: Record<number, boolean> = {}

    for (const vendorItem of drop.vendorItems) {
        const hasDrop = userHasDrop(
            settings,
            vendorItem.type,
            vendorItem.id,
            vendorItem.appearanceIds
        );

        total++;
        if (hasDrop) {
            have++;
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

        if (every(appearanceIds, (appearanceId) => userData.userHas[appearanceId])) {
            have++
        }

        total++
    }*/

    return [have, total];
}
