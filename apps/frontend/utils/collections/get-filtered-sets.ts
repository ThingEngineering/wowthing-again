import { ManualDataSetCategory, ManualDataSetGroup } from '@/types/data/manual'
import type { CollectionState } from '@/stores/local-storage'
import type { ManualDataSetGroupArray } from '@/types/data/manual'


export function getFilteredSets(
    collectionState: CollectionState,
    collectionKey: string,
    sets: ManualDataSetCategory[][],
    hasFunc: (things: number[]) => boolean
): ManualDataSetCategory[][] {
    const showCollected = collectionState.showCollected[collectionKey]
    const showUncollected = collectionState.showUncollected[collectionKey]

    if (showCollected && showUncollected) {
        return sets
    }

    const ret: ManualDataSetCategory[][] = []
    for (const categories of sets) {
        if (categories === null) {
            ret.push(null)
            continue
        }

        const newCategories: ManualDataSetCategory[] = []
        for (const category of categories) {
            const newGroups: ManualDataSetGroup[] = []
            for (const group of category.groups) {
                const newThings: number[][] = group.things.filter((thing) => {
                    const userHas = hasFunc(thing)
                    return (showCollected && userHas) || (showUncollected && !userHas)
                })

                if (newThings.length > 0) {
                    newGroups.push(new ManualDataSetGroup(group.name, newThings))
                }
            }

            const newGroupArrays: ManualDataSetGroupArray[] = newGroups.map((group) => [group.name, group.things])
            newCategories.push(new ManualDataSetCategory(category.name, category.slug, newGroupArrays))
        }

        ret.push(newCategories)
    }

    return ret
}
