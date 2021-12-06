import { get } from 'svelte/store'

import { data as settingsData } from '@/stores/settings'
import { getWowheadDomain } from '@/utils/get-wowhead-domain'
import type { CharacterEquippedItem } from '@/types'
import type { ItemSearchResponseCharacter } from '@/types/items'

export function getItemUrl(item: Partial<CharacterEquippedItem>): string {
    const settings = get(settingsData)
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

        url = `https://${getWowheadDomain(settings.general.language)}.wowhead.com/item=${item.itemId}`
    }

    if (params.length > 0) {
        url += `?${params.join('&')}`
    }

    return url
}

// TODO unify these once equipped item storage is updated
export function getItemUrlSearch(itemId: number, item: ItemSearchResponseCharacter): string {
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
