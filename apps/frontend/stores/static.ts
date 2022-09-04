import { extraInstanceMap } from '@/data/dungeon'
import { extraReputationTiers } from '@/data/reputation'
import { WritableFancyStore } from '@/types'
import {
    StaticDataBag,
    StaticDataCurrency,
    StaticDataCurrencyCategory,
    StaticDataInstance,
    StaticDataItem,
    StaticDataMount,
    StaticDataPet,
    StaticDataRealm,
    StaticDataReputation,
    StaticDataReputationCategory,
    StaticDataToy,
} from '@/types/data/static'
import type { StaticData } from '@/types/data/static/store'


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
            data.bags = StaticDataStore.createObjects(data.rawBags, StaticDataBag)
            data.rawBags = null
        }

        if (data.rawCurrencies !== null) {
            data.currencies = StaticDataStore.createObjects(data.rawCurrencies, StaticDataCurrency)
            data.rawCurrencies = null
        }

        if (data.rawCurrencyCategories !== null) {
            data.currencyCategories = StaticDataStore.createObjects(data.rawCurrencyCategories, StaticDataCurrencyCategory)
            data.rawCurrencyCategories = null
        }

        if (data.rawItems !== null) {
            data.items = StaticDataStore.createObjects(data.rawItems, StaticDataItem)
            data.rawItems = null
        }

        if (data.instancesRaw !== null) {
            data.instances = StaticDataStore.createObjects(data.instancesRaw, StaticDataInstance)
            data.instancesRaw = null

            for (const instanceId in extraInstanceMap) {
                data.instances[instanceId] = extraInstanceMap[instanceId]
            }
        }

        if (data.realmsRaw !== null) {
            data.realms = {
                0: new StaticDataRealm(0, 1, 0, 'Honkstrasza', 'honkstrasza'),
            }
            const connected: Record<number, {region: number, names: string[]}> = {}
            for (const realmArray of data.realmsRaw) {
                const obj = new StaticDataRealm(...realmArray)
                data.realms[obj.id] = obj

                if (obj.connectedRealmId > 0) {
                    if (connected[obj.connectedRealmId] === undefined) {
                        connected[obj.connectedRealmId] = {
                            region: obj.region,
                            names: [],
                        }
                    }
                    connected[obj.connectedRealmId].names.push(obj.name)
                }
            }
            data.realmsRaw = null

            data.connectedRealms = {}
            for (const [crId, {region, names}] of Object.entries(connected)) {
                names.sort()
                data.connectedRealms[parseInt(crId)] = {
                    id: parseInt(crId),
                    region: region,
                    displayText: names.join(' / '),
                    realmNames: names,
                }
            }
        }

        if (data.rawReputations !== null) {
            data.reputations = StaticDataStore.createObjects(data.rawReputations, StaticDataReputation)
            data.rawReputations = null

            for (const extraReputation of extraReputationTiers) {
                data.reputationTiers[extraReputation.id] = extraReputation
            }
        }

        if (data.rawReputationSets !== null) {
            data.reputationSets = []
            for (const repArray of data.rawReputationSets) {
                if (repArray === null) {
                    data.reputationSets.push(null)
                }
                else {
                    data.reputationSets.push(new StaticDataReputationCategory(...repArray))
                }
            }
            data.rawReputationSets = null
        }

        if (data.rawMounts !== null) {
            data.mounts = {}
            for (const mountArray of data.rawMounts) {
                const obj = new StaticDataMount(...mountArray)
                data.mounts[obj.id] = obj
            }
            data.rawMounts = null
        }

        if (data.rawPets !== null) {
            data.pets = {}
            data.petsByName = {}
            for (const petArray of data.rawPets) {
                const obj = new StaticDataPet(...petArray)
                data.pets[obj.id] = obj
                data.petsByName[obj.name] = obj
            }
            data.rawPets = null
        }

        if (data.rawToys !== null) {
            data.toys = StaticDataStore.createObjects(data.rawToys, StaticDataToy, (toy) => toy.itemId)
            data.rawToys = null
        }

        // console.timeEnd('StaticDataStore.initialize')
    }

    private static createObjects<TObject extends { id: number }>(
        arrays: any[][],
        objectConstructor: { new (...args: any[]): TObject },
        idFunc: (obj: TObject) => number = null
    ): Record<number, TObject>
    {
        const ret: Record<number, TObject> = {}
        for (const array of arrays) {
            const obj = new objectConstructor(...array)
            ret[idFunc?.(obj) ?? obj.id] = obj
        }
        return ret
    }
}

export const staticStore = new StaticDataStore()
