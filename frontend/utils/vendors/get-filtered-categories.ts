import getTransmogClassMask from '@/utils/get-transmog-class-mask'
import type { Settings } from '@/types'
import type {
    StaticDataVendorCategory,
    StaticDataVendorGroup,
    StaticDataVendorItem
} from '@/types/data/static'


export default function getFilteredCategories(
    settingsData: Settings,
    categories: StaticDataVendorCategory[]
): StaticDataVendorCategory[] {
    const classMask = getTransmogClassMask(settingsData)

    const newCategories: StaticDataVendorCategory[] = []
    for (const category of categories) {
        const newGroups: StaticDataVendorGroup[] = []
        for (const group of category.groups) {
            const newThings: StaticDataVendorItem[] = []
            for (const thing of group.things) {
                if (thing.classMask === 0 || (thing.classMask & classMask) > 0) {
                    newThings.push(thing)
                }
            }
            if (newThings.length > 0) {
                newGroups.push({
                    ...group,
                    things: newThings,
                })
            }
        }
        newCategories.push({
            ...category,
            groups: newGroups,
        })
    }

    return newCategories
}
