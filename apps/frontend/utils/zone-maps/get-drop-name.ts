import find from 'lodash/find'
import { get } from 'svelte/store'

import { difficultyMap } from '@/data/difficulty'
import { achievementStore, itemStore, staticStore } from '@/stores'
import { RewardType } from '@/types/enums'
import type { ManualDataZoneMapDrop } from '@/types/data/manual'


export function getDropName(drop: ManualDataZoneMapDrop): string {
    const achievementData = get(achievementStore).data
    const itemData = get(itemStore).data
    const staticData = get(staticStore).data

    if (drop.type === RewardType.Item ||
        drop.type === RewardType.Cosmetic ||
        drop.type === RewardType.Armor ||
        drop.type === RewardType.Weapon ||
        drop.type === RewardType.Transmog) {
        return itemData.items[drop.id]?.name || `Unknown item #${drop.id}`
    }
    else if (drop.type === RewardType.Achievement) {
        if (drop.subType > 0) {
            return achievementData.criteriaTree[drop.subType]?.description ?? `Criteria #${drop.subType}`
        }
        else {
            return achievementData.achievement[drop.id]?.name ?? `Achievement #${drop.id}`
        }
    }
    else if (drop.type === RewardType.Illusion) {
        const enchantmentId = drop.appearanceIds[0][0]
        const illusion = find(
            Object.values(staticData.illusions || {}),
            (illusion) => illusion.enchantmentId === enchantmentId
        )
        return illusion?.name || `Illusion #${enchantmentId}`
    }
    else if (drop.type === RewardType.Mount) {
        const mount = staticData.mounts[drop.id]
        return mount ? mount.name : `Unknown mount #${drop.id}`
    }
    else if (drop.type === RewardType.Pet) {
        const pet = staticData.pets[drop.id]
        return pet ? pet.name : `Unknown pet #${drop.id}`
    }
    else if (drop.type === RewardType.Toy) {
        const toy = staticData.toys[drop.id]
        return toy ? toy.name : `Unknown toy #${drop.id}`
    }
    else if (drop.type === RewardType.InstanceSpecial) {
        return difficultyMap[drop.id].name
    }
    else if (drop.type === RewardType.SetSpecial) {
        return drop.limit[0]
    }
    else {
        return "???"
    }
}
