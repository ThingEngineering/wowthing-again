import type { IconifyIcon } from '@iconify/types'

import { farmTypeIcons as oldFarmTypeIcons } from '@/data/icons'
import { farmTypeIcons, iconLibrary, professionIcons } from '@/icons'
import type { ManualDataZoneMapFarm } from '@/types/data/manual'


export function getFarmIcon(farm: ManualDataZoneMapFarm): IconifyIcon {
    let icon: IconifyIcon

    const professionLimits: Record<string, boolean> = {}
    for (const drop of (farm.drops || [])) {
        if (drop.limit?.[0] === 'profession') {
            professionLimits[drop.limit[1]] = true
        }
    }
    
    const keys = Object.keys(professionLimits)
    if (keys.length === 1) {
        icon = iconLibrary[professionIcons[keys[0]]]
    }

    return icon || iconLibrary[farmTypeIcons[farm.type]] || oldFarmTypeIcons[farm.type]
}
