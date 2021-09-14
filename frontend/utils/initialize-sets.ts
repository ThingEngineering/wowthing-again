import keys from 'lodash/keys'
import { get } from 'svelte/store'

import { staticStore, userStore, userPetStore } from '@/stores'
import type { Dictionary, StaticDataSetCategory } from '@/types'
import { UserDataSetCount } from '@/types'

export default function initializeSets(): void {
    console.time('initializeSets')

    const staticData = get(staticStore).data
    const userData = get(userStore).data
    const userPetData = get(userPetStore).data

    const setCounts: Dictionary<Dictionary<UserDataSetCount>> = {
        mounts: {},
        pets: {},
        toys: {},
    }

    doSetCounts(setCounts['mounts'], staticData.mountSets, userData.mounts, staticData.spellToMount)
    doSetCounts(setCounts['toys'], staticData.toySets, userData.toys)

    if (userPetData?.pets) {
        const petHas: Dictionary<boolean> = {}
        for (const key of keys(userPetData.pets)) {
            petHas[key] = true
        }

        doSetCounts(setCounts['pets'], staticData.petSets, petHas, staticData.creatureToPet)
    }

    userStore.update(state => {
        state.data.setCounts = setCounts
        return state
    })

    console.timeEnd('initializeSets')
}

function doSetCounts(
    setCounts: Dictionary<UserDataSetCount>,
    categories: StaticDataSetCategory[][],
    userHas: Dictionary<boolean>,
    map?: Dictionary<number>,
): void {
    for (const category of categories) {
        if (category === null) {
            continue
        }

        const categoryData = setCounts[category[0].slug] = new UserDataSetCount(0, 0)

        for (const set of category) {
            const setData = setCounts[`${category[0].slug}--${set.slug}`] = new UserDataSetCount(0, 0)

            for (const group of set.groups) {
                for (const things of group.things) {
                    categoryData.total++
                    setData.total++

                    for (const thing of things) {
                        if (
                            (map && userHas[map[thing]]) ||
                            (!map && userHas[thing])
                        ) {
                            categoryData.have++
                            setData.have++
                            break
                        }
                    }
                }
            }
        }
    }
}
