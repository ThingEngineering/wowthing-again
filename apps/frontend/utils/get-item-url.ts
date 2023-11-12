import { get } from 'svelte/store'

import { settingsStore } from '@/shared/stores/settings'
import type { Character, CharacterEquippedItem } from '@/types'
import type { ItemSearchResponseCommon } from '@/types/items'

export function getItemUrl(
    item: Partial<CharacterEquippedItem>,
    character?: Character,
    tierPieces?: number[]
): string {
    const settings = get(settingsStore)
    const useWowdb = settings.general.useWowdb

    let url = ''
    const params = []

    // WowDB
    if (useWowdb) {
        if (item.bonusIds?.length > 0) {
            params.push(`bonusIDs=${item.bonusIds.join(',')}`)
        }
        if (item.enchantmentIds?.length > 0) {
            // TODO find out if wowdb supports multiple enchantments
            params.push(`enchantment=${item.enchantmentIds[0]}`)
        }
        // TODO gems

        url = `https://www.wowdb.com/items/${item.itemId}`
    }
    // Wowhead
    else {
        if (item.bonusIds?.length > 0) {
            params.push(`bonus=${item.bonusIds.join(':')}`)
        }
        if (item.enchantmentIds?.length > 0) {
            params.push(`ench=${item.enchantmentIds[0]}`)
        }
        if (item.gemIds?.length > 0) {
            params.push(`gems=${item.gemIds.join(':')}`)
        }
        if (tierPieces?.indexOf(item.itemId) >= 0) {
            params.push(`class=${character.classId}`)
            params.push(`spec=${character.activeSpecId}`)
            params.push(`pcs=${tierPieces.filter((itemId) => itemId > 0).join(':')}`)
        }

        url = `https://${settingsStore.wowheadBaseUrl}/item=${item.itemId}`
    }

    if (params.length > 0) {
        url += `?${params.join('&')}`
    }

    return url
}

// TODO unify these once equipped item storage is updated
export function getItemUrlSearch<T extends ItemSearchResponseCommon>(
    itemId: number,
    item: T
): string {
    let url = getItemUrl({
        bonusIds: item.bonusIds ?? [],
        context: item.context ?? 0,
        enchantmentIds: item.enchantId > 0 ? [item.enchantId] : [],
        gemIds: item.gems ?? [],
        itemId: itemId,
        itemLevel: item.itemLevel,
        quality: item.quality,
    })

    const params: string[] = [
        `ilvl=${item.itemLevel}`,
    ]

    if (item.suffixId > 0) {
        params.push(`rand=${item.suffixId}`)
    }

    if (params.length > 0) {
        url += `${url.includes('?') ? '&' : '?'}${params.join('&')}`
    }

    return url
}
