import type { IconifyIcon } from '@iconify/types'

import { FarmType } from '@/enums/farm-type'
import { iconLibrary } from '@/shared/icons'
import { farmTypeIcons, professionSlugIcons } from '@/shared/icons/mappings'
import type { ManualDataZoneMapFarm } from '@/types/data/manual'


export function getFarmIcon(farm: ManualDataZoneMapFarm): [IconifyIcon, string] {
    const professionLimits: Record<string, boolean> = {}
    for (const drop of (farm.drops || [])) {
        if (drop.limit?.[0] === 'profession') {
            professionLimits[drop.limit[1]] = true
        }
    }
    
    const keys = Object.keys(professionLimits)
    const icon = (keys.length === 1 && farm.type !== FarmType.Kill)
        ? professionSlugIcons[keys[0]]
        : farmTypeIcons[farm.type]

    return [
        icon,
        getIconScaling(icon) || '0.9',
    ]
}

function getIconScaling(icon: IconifyIcon) {
    switch (icon) {
        case iconLibrary.gamePresent:
            return '1'
        case iconLibrary.gameTrophy:
            return '0.85'
    }
    return '0.9'
}
