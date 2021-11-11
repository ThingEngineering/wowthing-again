import sortBy from 'lodash/sortBy'

import { extraInstanceMap } from '@/data/dungeon'
import { WritableFancyStore } from '@/types'
import type { StaticData, StaticDataSetCategory } from '@/types'


export class StaticDataStore extends WritableFancyStore<StaticData> {
    get dataUrl(): string {
        return document.getElementById('app').getAttribute('data-static')
    }

    initialize(data: StaticData): void {
        console.time('StaticDataStore.initialize')

        data.realms[0] = {
            id: 0,
            region: 1,
            name: 'Honkstrasza',
            slug: 'honkstrasza',
        }

        for (const instanceId in extraInstanceMap) {
            data.instances[instanceId] = extraInstanceMap[instanceId]
        }

        data.mountSets = StaticDataStore.fixSets(data.mountSets)
        data.petSets = StaticDataStore.fixSets(data.petSets)
        data.toySets = StaticDataStore.fixSets(data.toySets)

        console.timeEnd('StaticDataStore.initialize')
    }

    private static fixSets(allSets: StaticDataSetCategory[][]): StaticDataSetCategory[][] {
        const newSets: StaticDataSetCategory[][] = []

        for (const sets of allSets) {
            if (sets === null) {
                newSets.push(null)
            }
            else {
                newSets.push(
                    sortBy(
                        sets,
                        (set) => [
                            set.name.startsWith('<') ? 0 : 1,
                            set.name.startsWith('>') ? 1 : 0,
                        ]
                    )
                )

                for (const set of newSets[newSets.length - 1]) {
                    if (set.name.startsWith('<') || set.name.startsWith('>')) {
                        set.name = set.name.substring(1)
                    }
                }
            }
        }

        return newSets
    }
}

export const staticStore = new StaticDataStore()
