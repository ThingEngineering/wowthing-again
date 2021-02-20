import type {CharacterEquippedItem} from '../types'

export function getItemUrl(item: CharacterEquippedItem): string {
    let url: string = ''

    // WowDB
    if (true) {
        let params = []
        if (item.bonusIds?.length > 0) {
            params.push('bonusIDs=' + item.bonusIds.join(','))
        }
        if (item.enchantmentIds?.length > 0) {
            // TODO find out if wowdb supports multiple enchantments
            params.push('enchantment=' + item.enchantmentIds[0])
        }
        // TODO gems

        url = `https://www.wowdb.com/items/${item.itemId}`
        if (params.length > 0) {
            url += `?${params.join('&')}`
        }
    }
    // Wowhead

    return url
}
