import { get } from 'svelte/store'

import { data as settingsData } from '@/stores/settings'
import type { CharacterEquippedItem } from '@/types'

export function getItemUrl(item: CharacterEquippedItem): string {
    const useWowdb = get(settingsData).general.useWowdb

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
            params.push(`bonus=${item.bonusIds.join(',')}`)
        }
        if (item.enchantmentIds?.length > 0) {
            params.push(`ench=${item.enchantmentIds[0]}`)
        }

        url = `https://www.wowhead.com/item=${item.itemId}`
    }

    if (params.length > 0) {
        url += `?${params.join('&')}`
    }

    return url
}
