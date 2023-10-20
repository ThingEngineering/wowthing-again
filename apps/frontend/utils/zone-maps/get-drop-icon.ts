import type { IconifyIcon } from '@iconify/types'
import { get } from 'svelte/store'

import { iconStrings, rewardTypeIcons } from '@/data/icons'
import { ArmorType } from '@/enums/armor-type'
import { RewardType } from '@/enums/reward-type'
import { WeaponSubclass } from '@/enums/weapon-subclass'
import { armorTypeIcons, iconLibrary, inventoryTypeIcons, weaponIcons } from '@/icons'
import { itemStore } from '@/stores'
import type { ManualData, ManualDataZoneMapDrop } from '@/types/data/manual'


export function getDropIcon(
    manualData: ManualData,
    drop: ManualDataZoneMapDrop,
    isCriteria: boolean
): IconifyIcon {
    let icon: IconifyIcon
    if (isCriteria) {
        icon = iconStrings['list']
    }
    else if (drop.type === RewardType.Armor) {
        // Cloth, Leather, Mail, Plate
        if (drop.subType >= 1 && drop.subType <= 4) {
            const item = get(itemStore).items[drop.id]
            icon = iconLibrary[inventoryTypeIcons[item?.inventoryType]]
        }
        // Misc
        else {
            icon = iconLibrary[armorTypeIcons[<ArmorType>drop.subType]]
        }
    }
    else if (drop.type === RewardType.Item) {
        if (manualData.dragonridingItemToQuest[drop.id]) {
            icon = iconLibrary['gameSpikedDragonHead']
        }
        else {
            const item = get(itemStore).items[drop.id]
            icon = iconLibrary[inventoryTypeIcons[item?.inventoryType]]
        }
    }
    else if (drop.type === RewardType.Reputation) {
        icon = iconLibrary['gameThumbUp']
    }
    else if (drop.type === RewardType.Weapon) {
        icon = iconLibrary[weaponIcons[<WeaponSubclass>drop.subType]]
    }

    return icon || rewardTypeIcons[drop.type]
}
