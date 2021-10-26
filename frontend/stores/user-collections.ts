import some from 'lodash/some'

import type {UserCollectionData} from '@/types/data'
import { Dictionary, StaticData, StaticDataSetCategory, UserDataSetCount, WritableFancyStore } from '@/types'
import { TypedArray } from '@/types/enums'
import base64ToDictionary from '@/utils/base64-to-dictionary'


export class UserCollectionDataStore extends WritableFancyStore<UserCollectionData> {
    get dataUrl(): string {
        let url = document.getElementById('app')?.getAttribute('data-user')
        if (url) {
            url += '/collections'
        }
        return url
    }

    setup(
        staticData: StaticData,
        userCollectionData: UserCollectionData
    ): void {
        console.time('UserCollectionDataStore.setup')

        // Unpack packed data
        const mounts = base64ToDictionary(TypedArray.Uint16, userCollectionData.mountsPacked)
        const toys = base64ToDictionary(TypedArray.Int32, userCollectionData.toysPacked)

        // Generate set counts
        const setCounts = {
            mounts: {},
            pets: {},
            toys: {},
        }

        const petsHas: Record<number, boolean> = {}
        for (const key in userCollectionData.pets) {
            petsHas[key] = true
        }

        UserCollectionDataStore.doSetCounts(
            setCounts['mounts'],
            staticData.mountSets,
            mounts,
            staticData.spellToMount
        )
        UserCollectionDataStore.doSetCounts(
            setCounts['pets'],
            staticData.petSets,
            petsHas,
            staticData.creatureToPet
        )
        UserCollectionDataStore.doSetCounts(
            setCounts['toys'],
            staticData.toySets,
            toys
        )

        this.update(state => {
            state.data.mounts = mounts
            state.data.mountsPacked = null
            state.data.toys = toys
            state.data.toysPacked = null

            state.data.petsHas = petsHas
            state.data.setCounts = setCounts

            return state
        })

        console.timeEnd('UserCollectionDataStore.setup')
    }

    private static doSetCounts(
        setCounts: Dictionary<UserDataSetCount>,
        categories: StaticDataSetCategory[][],
        userHas: Dictionary<boolean>,
        map?: Dictionary<number>,
    ): void {
        const overallData = setCounts['OVERALL'] = new UserDataSetCount(0, 0)
        const seen: Record<number, boolean> = {}

        for (const category of categories) {
            if (category === null) {
                continue
            }

            const categoryData = setCounts[category[0].slug] = new UserDataSetCount(0, 0)

            for (const set of category) {
                const setData = setCounts[`${category[0].slug}--${set.slug}`] = new UserDataSetCount(0, 0)

                for (const group of set.groups) {
                    // We only want to increase some counts if the set is not
                    // unavailable
                    const doCategory = (
                        category[0].slug === 'unavailable' ||
                        (
                            set.slug !== 'unavailable' &&
                            group.name.indexOf('Unavailable') < 0
                        )
                    )

                    for (const things of group.things) {
                        const seenThing = some(things, (t) => seen[t])

                        const doOverall = (
                            category[0].slug !== 'unavailable' &&
                            doCategory &&
                            !seenThing
                        )

                        if (doCategory) {
                            categoryData.total++
                        }
                        if (doOverall) {
                            overallData.total++
                        }

                        setData.total++

                        for (const thing of things) {
                            if (
                                (map && userHas[map[thing]]) ||
                                (!map && userHas[thing])
                            ) {
                                if (doCategory) {
                                    categoryData.have++
                                }
                                if (doOverall) {
                                    overallData.have++
                                }

                                setData.have++

                                break
                            }
                        }

                        for (const thing of things) {
                            seen[thing] = true
                        }
                    }
                }
            }
        }
    }
}

export const userCollectionStore = new UserCollectionDataStore()
