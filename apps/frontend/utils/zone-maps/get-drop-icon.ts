import type { IconifyIcon } from '@iconify/types'

import { iconStrings, rewardTypeIcons } from '@/data/icons'
import { weaponIcons } from '@/icons'
import type { DropStatus } from '@/types'
import type { ManualDataZoneMapDrop } from '@/types/data/manual'
import { RewardType, WeaponSubclass } from '@/enums'


export function getDropIcon(
    drop: ManualDataZoneMapDrop,
    status: DropStatus,
    isCriteria: boolean
): IconifyIcon {
    let icon: IconifyIcon
    if (isCriteria) {
        icon = iconStrings['list']
    }
    else if (drop.type === RewardType.Weapon) {
        icon = weaponIcons[<WeaponSubclass>drop.subType]
    }

    return icon || rewardTypeIcons[drop.type]
}
