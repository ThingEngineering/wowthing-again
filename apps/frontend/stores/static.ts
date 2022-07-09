import sortBy from 'lodash/sortBy'

import { zoneMapStore } from './zone-map'
import { extraInstanceMap } from '@/data/dungeon'
import { WritableFancyStore } from '@/types'
import {
    StaticDataCurrency,
    StaticDataCurrencyCategory,
    StaticDataInstance,
    StaticDataMount,
    StaticDataPet,
    StaticDataRealm,
    StaticDataReputation,
    StaticDataSetCategory,
    StaticDataToy,
} from '@/types/data/static'
import type { StaticData, StaticDataSetCategoryArray } from '@/types/data/static'
import { extraReputationTiers } from '@/data/reputation'
import { StaticDataBag } from '@/types/data/static/bag'


export class StaticDataStore extends WritableFancyStore<StaticData> {
    get dataUrl(): string {
        return document.getElementById('app').getAttribute('data-static')
    }

    initialize(data: StaticData): void {
        // console.time('StaticDataStore.initialize')

        data.characterClassesBySlug = {}
        for (const cls of Object.values(data.characterClasses)) {
            data.characterClassesBySlug[cls.slug] = cls

            cls.mask = 2 ** (cls.id - 1)
            cls.specializationIds = []

            const specs = Object.values(data.characterSpecializations)
                .filter((spec) => spec.classId === cls.id)
            specs.sort((a, b) => a.order - b.order)
            cls.specializationIds = specs.map((spec) => spec.id)
        }

        if (data.rawBags !== null) {
            data.bags = {}
            for (const bagArray of data.rawBags) {
                const obj = new StaticDataBag(...bagArray)
                data.bags[obj.id] = obj
            }
            data.rawBags = null
        }

        if (data.rawCurrencies !== null) {
            data.currencies = {}
            for (const currencyArray of data.rawCurrencies) {
                const obj = new StaticDataCurrency(...currencyArray)
                data.currencies[obj.id] = obj
            }
            data.rawCurrencies = null
        }

        if (data.rawCurrencyCategories !== null) {
            data.currencyCategories = {}
            for (const categoryArray of data.rawCurrencyCategories) {
                const obj = new StaticDataCurrencyCategory(...categoryArray)
                data.currencyCategories[obj.id] = obj
            }
            data.rawCurrencyCategories = null
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
                0: new StaticDataRealm(0, 1, 0, 'Honkstrasza', 'honkstrasza'),
            }
            const connected: Record<number, string[]> = {}
            for (const realmArray of data.realmsRaw) {
                const obj = new StaticDataRealm(...realmArray)
                data.realms[obj.id] = obj

                if (obj.connectedRealmId > 0) {
                    if (connected[obj.connectedRealmId] === undefined) {
                        connected[obj.connectedRealmId] = []
                    }
                    connected[obj.connectedRealmId].push(obj.name)
                }
            }
            data.realmsRaw = null

            data.connectedRealms = {}
            for (const crId in connected) {
                connected[crId].sort()
                data.connectedRealms[crId] = {
                    id: parseInt(crId),
                    displayText: connected[crId].join(' / '),
                    realmNames: connected[crId],
                }
            }
        }

        if (data.reputationsRaw !== null) {
            data.reputations = {}
            for (const reputationArray of data.reputationsRaw) {
                const obj = new StaticDataReputation(...reputationArray)
                data.reputations[obj.id] = obj
            }
            data.reputationsRaw = null

            for (const extraReputation of extraReputationTiers) {
                data.reputationTiers[extraReputation.id] = extraReputation
            }
        }

        if (data.rawMounts !== null) {
            data.mounts = {}
            data.mountsBySpellId = {}
            for (const mountArray of data.rawMounts) {
                const obj = new StaticDataMount(...mountArray)
                data.mounts[obj.id] = obj
                data.mountsBySpellId[obj.spellId] = obj
            }
            data.rawMounts = null
        }

        if (data.rawPets !== null) {
            data.pets = {}
            data.petsByCreatureId = {}
            for (const petArray of data.rawPets) {
                const obj = new StaticDataPet(...petArray)
                data.pets[obj.id] = obj
                data.petsByCreatureId[obj.creatureId] = obj
            }
            data.rawPets = null
        }

        if (data.rawToys !== null) {
            data.toys = {}
            for (const toyArray of data.rawToys) {
                const obj = new StaticDataToy(...toyArray)
                data.toys[obj.id] = obj
            }
            data.rawToys = null
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

        // console.timeEnd('StaticDataStore.initialize')

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
