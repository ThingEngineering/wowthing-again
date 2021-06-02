import {data as sData} from '@/stores/static-store'
import {data as uData} from '@/stores/user-store'
import type {Dictionary, StaticData, StaticDataSetCategory, UserData} from '@/types'

let staticData: StaticData
sData.subscribe(value => {
    staticData = value
})

let userData: UserData
uData.subscribe(value => {
    userData = value
})

export default function initializeSets() {
    console.time('initializeSets')
    userData.setCounts = {}

    sigh('mounts', staticData.MountSets, userData.mounts, staticData.SpellToMount)
    sigh('pets', staticData.PetSets, {})
    sigh('toys', staticData.ToySets, userData.toys)

    console.timeEnd('initializeSets')
}

function sigh(category: string, sets: StaticDataSetCategory[][], userHas: Dictionary<number>, map?: Dictionary<number>) {
    userData.setCounts[category] = {}

    for (let i = 0; i < sets.length; i++) {
        const categories = sets[i]
        if (categories === null) {
            continue;
        }

        let categoryHave = 0, categoryTotal = 0

        for (let j = 0; j < categories.length; j++) {
            const section = categories[j]
            let sectionHave = 0, sectionTotal = 0

            for (let k = 0; k < section.Groups.length; k++) {
                const group = section.Groups[k]

                for (let l = 0; l < group.Things.length; l++) {
                    const things = group.Things[l]
                    categoryTotal++
                    sectionTotal++

                    for (let m = 0; m < things.length; m++) {
                        const thing = things[m]
                        if ((map && userHas[map[thing]]) || (!map && userHas[thing])) {
                            categoryHave++
                            sectionHave++
                            break
                        }
                    }
                }
            }

            userData.setCounts[category][`${categories[0].Slug}_${section.Slug}`] = { have: sectionHave, total: sectionTotal }
        }

        userData.setCounts[category][categories[0].Slug] = { have: categoryHave, total: categoryTotal }
    }
}
