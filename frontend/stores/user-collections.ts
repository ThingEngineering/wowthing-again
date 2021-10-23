import some from 'lodash/some'
import {get} from 'svelte/store'

import type {UserCollectionData} from '@/types/data'
import {staticStore} from '@/stores/static'
import {Dictionary, StaticDataSetCategory, UserDataSetCount, WritableFancyStore} from '@/types'
import {TypedArray} from '@/types/enums'
import base64ToDictionary from '@/utils/base64-to-dictionary'


export class UserCollectionDataStore extends WritableFancyStore<UserCollectionData> {
    get dataUrl(): string {
        let url = document.getElementById('app')?.getAttribute('data-user')
        if (url) {
            url += '/collections'
        }
        return url
    }

    initialize(data: UserCollectionData): void {
        console.time('UserCollectionDataStore.initialize')

        // Unpack packed data
        data.mounts = base64ToDictionary(TypedArray.Uint16, data.mountsPacked)
        data.toys = base64ToDictionary(TypedArray.Int32, data.toysPacked)

        data.mountsPacked = null
        data.toysPacked = null

        // Generate set counts
        const staticData = get(staticStore).data

        data.setCounts = {
            mounts: {},
            pets: {},
            toys: {},
        }

        data.petsHas = {}
        for (const key in data.pets) {
            data.petsHas[key] = true
        }

        UserCollectionDataStore.doSetCounts(
            data.setCounts['mounts'],
            staticData.mountSets,
            data.mounts,
            staticData.spellToMount
        )
        UserCollectionDataStore.doSetCounts(
            data.setCounts['pets'],
            staticData.petSets,
            data.petsHas,
            staticData.creatureToPet
        )
        UserCollectionDataStore.doSetCounts(
            data.setCounts['toys'],
            staticData.toySets,
            data.toys
        )

        console.timeEnd('UserCollectionDataStore.initialize')
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
                    for (const things of group.things) {
                        const seenThing = some(things, (t) => seen[t])

                        // We only want to increase some counts if the set is not
                        // unavailable
                        const doCategory = (
                            set.slug !== 'unavailable' &&
                            group.name.indexOf('Unavailable') < 0
                        )

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
