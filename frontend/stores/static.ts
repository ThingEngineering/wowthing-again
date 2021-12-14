import sortBy from 'lodash/sortBy'

import { zoneMapStore } from './zone-map'
import { extraInstanceMap } from '@/data/dungeon'
import {
    StaticDataCurrency,
    StaticDataInstance,
    StaticDataRealm,
    StaticDataReputation,
    StaticDataSetCategory,
    WritableFancyStore,
} from '@/types'
import type { StaticData, StaticDataSetCategoryArray } from '@/types'


export class StaticDataStore extends WritableFancyStore<StaticData> {
    get dataUrl(): string {
        return document.getElementById('app').getAttribute('data-static')
    }

    initialize(data: StaticData): void {
        console.time('StaticDataStore.initialize')

        if (data.currenciesRaw !== null) {
            data.currencies = {}
            for (const currencyArray of data.currenciesRaw) {
                const obj = new StaticDataCurrency(...currencyArray)
                data.currencies[obj.id] = obj
            }
            data.currenciesRaw = null
        }

        if (data.instancesRaw !== null) {
            data.instances = {}
            for (const instanceArray of data.instancesRaw) {
                const obj = new StaticDataInstance(...instanceArray)
                data.instances[obj.id] = obj
            }
            data.instancesRaw = null

            for (const instanceId in extraInstanceMap) {
                data.instances[instanceId] = extraInstanceMap[instanceId]
            }
        }

        if (data.realmsRaw !== null) {
            data.realms = {
                0: new StaticDataRealm(0, 1, 'Honkstrasza', 'honkstrasza'),
            }
            for (const realmArray of data.realmsRaw) {
                const obj = new StaticDataRealm(...realmArray)
                data.realms[obj.id] = obj
            }
            data.realmsRaw = null
        }

        if (data.reputationsRaw !== null) {
            data.reputations = {}
            for (const reputationArray of data.reputationsRaw) {
                const obj = new StaticDataReputation(...reputationArray)
                data.reputations[obj.id] = obj
            }
            data.reputationsRaw = null
        }

        if (
            data.mountSetsRaw !== null &&
            data.petSetsRaw !== null &&
            data.toySetsRaw !== null
        ) {
            data.mountSets = StaticDataStore.fixSets(data.mountSetsRaw)
            data.petSets = StaticDataStore.fixSets(data.petSetsRaw)
            data.toySets = StaticDataStore.fixSets(data.toySetsRaw)
        }

        console.timeEnd('StaticDataStore.initialize')

        zoneMapStore.update((state) => {
            state.data = {
                sets: data.zoneMapSets,
            }
            state.loaded = true
            return state
        })
    }

    private static fixSets(allSets: StaticDataSetCategoryArray[][]): StaticDataSetCategory[][] {
        const newSets: StaticDataSetCategory[][] = []

        for (const sets of allSets) {
            if (sets === null) {
                newSets.push(null)
                continue
            }

            const actualSets = sets.map(
                (set) => new StaticDataSetCategory(...set)
            )

            newSets.push(
                sortBy(
                    actualSets,
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

        return newSets
    }
}

export const staticStore = new StaticDataStore()
