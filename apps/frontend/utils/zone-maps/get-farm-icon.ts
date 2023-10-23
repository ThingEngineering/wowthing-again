import type { IconifyIcon } from '@iconify/types'

import { farmTypeIcons, iconLibrary, iconScaling, professionIcons } from '@/shared/icons'
import type { ManualDataZoneMapFarm } from '@/types/data/manual'
import { FarmType } from '@/enums/farm-type'


export function getFarmIcon(farm: ManualDataZoneMapFarm): [IconifyIcon, string] {
    let iconName = ''

    const professionLimits: Record<string, boolean> = {}
    for (const drop of (farm.drops || [])) {
        if (drop.limit?.[0] === 'profession') {
            professionLimits[drop.limit[1]] = true
        }
    }
    
    const keys = Object.keys(professionLimits)
    iconName = (keys.length === 1 && farm.type !== FarmType.Kill)
        ? professionIcons[keys[0]]
        : farmTypeIcons[farm.type]

    return [
        iconLibrary[iconName],
        iconScaling[iconName] || '0.9',
    ]
}
