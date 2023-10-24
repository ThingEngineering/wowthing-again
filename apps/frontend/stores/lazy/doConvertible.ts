import { PlayableClassMask } from '@/enums/playable-class'
import { LazyStores, LazyConvertible } from './convertible'


export function doConvertible(
    stores: LazyStores
): LazyConvertible {
    console.time('doConvertible')

    const classMask = PlayableClassMask[PlayableClass[classId] as keyof typeof PlayableClassMask]
    const itemData = get(itemStore)

    const ret = {}
    for (const itemId of itemData.itemConversionEntries[seasonId]) {
        const item = itemData.items[itemId]
        if (item.classMask !== classMask) {
            continue
        }

        ret[item.inventoryType] = item
    }

    console.log(ret)
}
