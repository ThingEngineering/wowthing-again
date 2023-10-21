import type { IconifyIcon } from '@iconify/types'

import { farmTypeIcons as oldFarmTypeIcons } from '@/data/icons'
import { farmTypeIcons, iconLibrary, iconScaling, professionIcons } from '@/icons'
import type { ManualDataZoneMapFarm } from '@/types/data/manual'


export function getFarmIcon(farm: ManualDataZoneMapFarm): [IconifyIcon, string] {
    let iconName = ''

    const professionLimits: Record<string, boolean> = {}
    for (const drop of (farm.drops || [])) {
        if (drop.limit?.[0] === 'profession') {
            professionLimits[drop.limit[1]] = true
        }
    }
    
    const keys = Object.keys(professionLimits)
    iconName = keys.length === 1 ? professionIcons[keys[0]] : farmTypeIcons[farm.type]

    return [
        iconLibrary[iconName] || oldFarmTypeIcons[farm.type],
        iconScaling[iconName] || '0.9',
    ]
}
