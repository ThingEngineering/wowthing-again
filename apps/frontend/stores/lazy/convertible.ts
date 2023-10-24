import { InventoryType } from '@/enums/inventory-type'
import { PlayableClass, playableClasses } from '@/enums/playable-class'
import type { UserData } from '@/types'
import type { UserTransmogData } from '@/types/data'
import type { ItemData, ItemDataItem } from '@/types/data/item'

interface LazyStores {
    itemData: ItemData,
    userData: UserData,
    userTransmogData: UserTransmogData,
}

export type LazyConvertible = Record<number, Record<number, Record<number, ItemDataItem>>>

export function doConvertible(
    stores: LazyStores,
): LazyConvertible {
    console.time('doConvertible')

    const maskToClass: Record<number, number> = Object.fromEntries(
        playableClasses.map(([name, mask]) => [
            mask,
            PlayableClass[name as keyof typeof PlayableClass]
        ])
    )
    
    const ret: LazyConvertible = {}
    for (const [seasonId, itemIds] of Object.entries(stores.itemData.itemConversionEntries)) {
        const season: Record<number, Record<number, ItemDataItem>> = ret[parseInt(seasonId)] = {}
        for (const itemId of itemIds) {
            const item = stores.itemData.items[itemId]
            const classId = maskToClass[item.classMask]
            const inventoryType = item.inventoryType === InventoryType.Chest2 ? InventoryType.Chest : item.inventoryType
            season[classId] ||= {}
            season[classId][inventoryType] = item
        }
    }

    console.timeEnd('doConvertible')

    return ret
}
