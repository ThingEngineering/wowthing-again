import type { IconifyIcon } from '@iconify/types'

import { iconStrings, rewardTypeIcons } from '@/data/icons'
import { ArmorType } from '@/enums/armor-type'
import { RewardType } from '@/enums/reward-type'
import { WeaponSubclass } from '@/enums/weapon-subclass'
import { armorTypeIcons, iconLibrary, inventoryTypeIcons, professionIcons, weaponIcons } from '@/icons'
import type { ManualData, ManualDataZoneMapDrop } from '@/types/data/manual'
import type { StaticData } from '@/shared/stores/static/types'
import type { ItemData } from '@/types/data/item'


export function getDropIcon(
    itemData: ItemData,
    manualData: ManualData,
    staticData: StaticData,
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
            const item = itemData.items[drop.id]
            icon = iconLibrary[inventoryTypeIcons[item?.inventoryType]]
        }
        // Misc
        else {
            icon = iconLibrary[armorTypeIcons[<ArmorType>drop.subType]]
        }
    }
    else if (drop.type === RewardType.Item) {
        console.log(drop.id, itemData.teachesSpell[drop.id])
        if (manualData.dragonridingItemToQuest[drop.id]) {
            icon = iconLibrary['gameSpikedDragonHead']
        }
        else if (itemData.teachesSpell[drop.id]) {
            const [skillLineId,] = staticData.itemToSkillLine[drop.id]
            const [profession,] = staticData.professionBySkillLine[skillLineId]
            icon = iconLibrary[professionIcons[profession.slug]]
        }
        else {
            const item = itemData.items[drop.id]
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
