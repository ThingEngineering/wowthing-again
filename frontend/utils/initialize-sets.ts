import keys from 'lodash/keys'
import { get } from 'svelte/store'

import { staticStore, userStore, userPetStore } from '@/stores'
import type { Dictionary, StaticDataSetCategory, UserDataSetCount } from '@/types'

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
    sets: StaticDataSetCategory[][],
    userHas: Dictionary<boolean>,
    map?: Dictionary<number>,
): void {
    for (let setIndex = 0; setIndex < sets.length; setIndex++) {
        const categories = sets[setIndex]
        if (categories === null) {
            continue
        }

        let categoryHave = 0,
            categoryTotal = 0

        for (let catIndex = 0; catIndex < categories.length; catIndex++) {
            const section = categories[catIndex]
            let sectionHave = 0,
                sectionTotal = 0

            for (let sectionIndex = 0; sectionIndex < section.groups.length; sectionIndex++) {
                const group = section.groups[sectionIndex]

                for (let groupThingIndex = 0; groupThingIndex < group.things.length; groupThingIndex++) {
                    const things = group.things[groupThingIndex]
                    categoryTotal++
                    sectionTotal++

                    for (let thingIndex = 0; thingIndex < things.length; thingIndex++) {
                        const thing = things[thingIndex]
                        if (
                            (map && userHas[map[thing]]) ||
                            (!map && userHas[thing])
                        ) {
                            categoryHave++
                            sectionHave++
                            break
                        }
                    }
                }
            }

            setCounts[`${categories[0].slug}_${section.slug}`] = { have: sectionHave, total: sectionTotal }
        }

        setCounts[categories[0].slug] = {
            have: categoryHave,
            total: categoryTotal,
        }
    }
}
