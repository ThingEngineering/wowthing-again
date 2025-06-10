import type { IconifyIcon } from '@iconify/types';

import { iconStrings } from '@/data/icons';
import { ArmorType } from '@/enums/armor-type';
import { RewardType } from '@/enums/reward-type';
import { WeaponSubclass } from '@/enums/weapon-subclass';
import { iconLibrary } from '@/shared/icons';
import {
    armorTypeIcons,
    inventoryTypeIcons,
    professionSlugIcons,
    rewardTypeIcons,
    weaponSubclassIcons,
} from '@/shared/icons/mappings';
import { wowthingData } from '@/shared/stores/data';
import type { ManualDataZoneMapDrop } from '@/types/data/manual';

export function getDropIcon(drop: ManualDataZoneMapDrop, isCriteria: boolean): IconifyIcon {
    const manualData = wowthingData.manual;

    let icon: IconifyIcon;
    if (isCriteria) {
        icon = iconStrings['list'];
    } else if (drop.type === RewardType.Armor) {
        // Cloth, Leather, Mail, Plate
        if (drop.subType >= 1 && drop.subType <= 4) {
            const item = wowthingData.items.items[drop.id];
            icon = inventoryTypeIcons[item?.inventoryType];
        }
        // Misc
        else {
            icon = armorTypeIcons[<ArmorType>drop.subType];
        }
    } else if (drop.type === RewardType.Item) {
        if (manualData.dragonridingItemToQuest.get(drop.id)) {
            icon = iconLibrary.gameSpikedDragonHead;
        } else if (manualData.druidFormItemToQuest.get(drop.id)) {
            icon = iconLibrary.gameBearFace;
        } else if (wowthingData.static.mountByItemId.has(drop.id)) {
            icon = rewardTypeIcons[RewardType.Mount];
        } else if (wowthingData.static.petByItemId.has(drop.id)) {
            icon = rewardTypeIcons[RewardType.Pet];
        } else if (wowthingData.items.teachesSpell[drop.id]) {
            const [skillLineId] = wowthingData.static.itemToSkillLine[drop.id];
            const [profession] = wowthingData.static.professionBySkillLineId.get(skillLineId);
            icon = professionSlugIcons[profession.slug];
        } else if (drop.limit?.[0] === 'profession') {
            icon = professionSlugIcons[drop.limit[1]];
        } else {
            const item = wowthingData.items.items[drop.id];
            icon = inventoryTypeIcons[item?.inventoryType];
        }
    } else if (drop.type === RewardType.Reputation) {
        icon = iconLibrary['gameThumbUp'];
    } else if (drop.type === RewardType.Weapon) {
        icon = weaponSubclassIcons[<WeaponSubclass>drop.subType];
    } else if (drop.limit?.[0] === 'profession') {
        icon = professionSlugIcons[drop.limit[1]];
    }

    return icon || rewardTypeIcons[drop.type];
}
