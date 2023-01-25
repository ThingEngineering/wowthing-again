import { ManualDataSetCategory, ManualDataSetGroup } from '@/types/data/manual'
import type { CollectibleState } from '@/stores/local-storage'
import type { Settings } from '@/types'
import type { ManualDataSetGroupArray } from '@/types/data/manual'


export function getFilteredSets(
    settings: Settings,
    collectibleState: CollectibleState,
    collectionKey: string,
    categories: ManualDataSetCategory[][],
    hasFunc: (things: number[]) => boolean
): ManualDataSetCategory[][] {
    const hideUnavailable = settings.collections.hideUnavailable
    const showCollected = collectibleState.showCollected[collectionKey]
    const showUncollected = collectibleState.showUncollected[collectionKey]

    if (!hideUnavailable && showCollected && showUncollected) {
        return categories
    }

    const ret: ManualDataSetCategory[][] = []
    for (const category of categories) {
        if (category === null) {
            ret.push(null)
            continue
        }

        const categoryUnavailable = category[0].slug === 'unavailable'

        const newCategory: ManualDataSetCategory[] = []
        for (const set of category) {
            const setUnavailable = set.slug === 'unavailable'
            const newGroups: ManualDataSetGroup[] = []
            for (const group of set.groups) {
                const groupUnavailable = group.name.indexOf('Unavailable') >= 0
                const newThings: number[][] = group.things.filter((thing) => {
                    const userHas = hasFunc(thing)

                    if (
                        hideUnavailable &&
                        (categoryUnavailable || setUnavailable || groupUnavailable) &&
                        !userHas
                    ) {
                        return false
                    }

                    return (showCollected && userHas) || (showUncollected && !userHas)
                })

                if (newThings.length > 0) {
                    newGroups.push(new ManualDataSetGroup(group.name, newThings))
                }
            }

            const newGroupArrays: ManualDataSetGroupArray[] = newGroups.map((group) => [group.name, group.things])
            newCategory.push(new ManualDataSetCategory(set.name, set.slug, newGroupArrays))
        }

        ret.push(newCategory)
    }

    return ret
}
