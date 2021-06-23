import { data as sData } from '@/stores/static'
import { data as uData } from '@/stores/user'
import type {
    Dictionary,
    StaticData,
    StaticDataSetCategory,
    UserData,
} from '@/types'

let staticData: StaticData
sData.subscribe((value) => {
    staticData = value
})

let userData: UserData
uData.subscribe((value) => {
    userData = value
})

export default function initializeSets(): void {
    console.time('initializeSets')
    userData.setCounts = {}

    sigh(
        'mounts',
        staticData.mountSets,
        userData.mounts,
        staticData.spellToMount,
    )
    sigh('pets', staticData.petSets, {})
    sigh('toys', staticData.toySets, userData.toys)

    console.timeEnd('initializeSets')
}

function sigh(
    category: string,
    sets: StaticDataSetCategory[][],
    userHas: Dictionary<number>,
    map?: Dictionary<number>,
) {
    userData.setCounts[category] = {}

    for (let i = 0; i < sets.length; i++) {
        const categories = sets[i]
        if (categories === null) {
            continue
        }

        let categoryHave = 0,
            categoryTotal = 0

        for (let j = 0; j < categories.length; j++) {
            const section = categories[j]
            let sectionHave = 0,
                sectionTotal = 0

            for (let k = 0; k < section.groups.length; k++) {
                const group = section.groups[k]

                for (let l = 0; l < group.things.length; l++) {
                    const things = group.things[l]
                    categoryTotal++
                    sectionTotal++

                    for (let m = 0; m < things.length; m++) {
                        const thing = things[m]
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

            userData.setCounts[category][
                `${categories[0].slug}_${section.slug}`
            ] = { have: sectionHave, total: sectionTotal }
        }

        userData.setCounts[category][categories[0].slug] = {
            have: categoryHave,
            total: categoryTotal,
        }
    }
}
