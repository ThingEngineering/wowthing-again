import { StaticDataSetCategory, StaticDataSetGroup, StaticDataSetGroupArray } from '@/types'
import type { CollectionState } from '@/stores/local-storage'


export function getFilteredSets(
    collectionState: CollectionState,
    collectionKey: string,
    sets: StaticDataSetCategory[][],
    hasFunc: (things: number[]) => boolean
): StaticDataSetCategory[][] {
    const showCollected = collectionState.showCollected[collectionKey]
    const showUncollected = collectionState.showUncollected[collectionKey]

    if (showCollected && showUncollected) {
        return sets
    }

    const ret: StaticDataSetCategory[][] = []
    for (const categories of sets) {
        if (categories === null) {
            ret.push(null)
            continue
        }

        const newCategories: StaticDataSetCategory[] = []
        for (const category of categories) {
            const newGroups: StaticDataSetGroup[] = []
            for (const group of category.groups) {
                const newThings: number[][] = group.things.filter((thing) => {
                    const userHas = hasFunc(thing)
                    return (showCollected && userHas) || (showUncollected && !userHas)
                })

                if (newThings.length > 0) {
                    newGroups.push(new StaticDataSetGroup(group.name, newThings))
                }
            }

            const newGroupArrays: StaticDataSetGroupArray[] = newGroups.map((group) => [group.name, group.things])
            newCategories.push(new StaticDataSetCategory(category.name, category.slug, newGroupArrays))
        }

        ret.push(newCategories)
    }

    return ret
}
