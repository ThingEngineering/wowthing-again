import {data as sData} from '../stores/static-store'
import {data as uData} from '../stores/user-store'
import type {Dictionary, StaticData, StaticDataSetCategory, UserData} from '../types'

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

    sigh("mounts", staticData.MountSets, userData.mounts, staticData.SpellToMount)
    sigh("pets", staticData.PetSets, {})
    sigh("toys", staticData.ToySets, {})

    console.timeEnd('initializeSets')
}

function sigh(thing: string, sets: StaticDataSetCategory[], userHas: Dictionary<number>, map?: Dictionary<number>) {
    userData.setCounts[thing] = {}

    for (let i = 0; i < sets.length; i++) {
        const category = sets[i]
        let have = 0, total = 0

        for (let j = 0; j < category.Groups.length; j++) {
            const group = category.Groups[j]

            for (let k = 0; k < group.Things.length; k++) {
                const things = group.Things[k]

                for (let l = 0; l < things.length; l++) {
                    const thing = things[l]
                    if ((map && userHas[map[thing]]) || (!map && userHas[thing])) {
                        have++
                    }
                    total++
                }
            }
        }

        userData.setCounts[thing][category.Slug] = { have, total }
    }
}
