import type { IconifyIcon } from '@iconify/types'

import { farmTypeIcons } from '@/data/icons'
import type { ManualDataZoneMapFarm } from '@/types/data/manual'
import { iconLibrary, professionIcons } from '@/icons'
import { FarmType } from '@/enums'


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
    
    // TODO port farmTypeIcons to icon library
    if (farm.type === FarmType.Kill) {
        //icon = iconLibrary['gameDeathSkull']
    }
    else if (farm.type === FarmType.KillBig) {
        icon = iconLibrary['gameCrownedSkull']
    }
    else if (farm.type === FarmType.Treasure) {
        icon = iconLibrary['gameLockedChest']
    }

    return icon || farmTypeIcons[farm.type]
}
