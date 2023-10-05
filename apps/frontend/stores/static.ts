import { extraInstanceMap } from '@/data/dungeon'
import { WritableFancyStore, type Settings } from '@/types'
import {
    StaticDataBag,
    StaticDataCurrency,
    StaticDataCurrencyCategory,
    StaticDataHoliday,
    StaticDataInstance,
    StaticDataMount,
    StaticDataPet,
    StaticDataProfessionCategory,
    StaticDataRealm,
    StaticDataReputation,
    StaticDataReputationCategory,
    StaticDataToy,
    StaticDataTransmogSet,
} from '@/types/data/static'
import type { StaticData } from '@/types/data/static/store'


export class StaticDataStore extends WritableFancyStore<StaticData> {
    get dataUrl(): string {
        return document.getElementById('app').getAttribute('data-static')
    }

    initialize(data: StaticData): void {
        console.time('StaticDataStore.initialize')

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

        data.characterRacesBySlug = Object.fromEntries(
            Object.values(data.characterRaces)
                .map((race) => [
                    race.slug === 'pandaren' ? `pandaren${race.faction}` : race.slug,
                    race,
                ])
        )

        data.itemToSkillLineAbility = {}
        data.professionBySkillLine = {}
        for (const profession of Object.values(data.professions)) {
            if (profession.rawCategories != null) {
                profession.categories = profession.rawCategories.map(
                    (categoryArray) => new StaticDataProfessionCategory(...categoryArray)
                )
                profession.rawCategories = null
            }

            data.professionBySkillLine[profession.id] = [profession, 0]
            for (let i = 0; i < profession.subProfessions.length; i++) {
                const subProfession = profession.subProfessions[i]
                data.professionBySkillLine[subProfession.id] = [profession, i]
            }

            for (const category of (profession.categories || [])) {
                for (const subCategory of category.children) {
                    for (const subSubCategory of subCategory.children) {
                        for (const ability of subSubCategory.abilities) {
                            for (const itemId of ability.itemIds) {
                                if (itemId > 0) {
                                    data.itemToSkillLineAbility[itemId] = ability.id
                                }
                            }
                        }
                    }
                }
            }
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

        if (data.rawHolidays !== null) {
            data.holidays = StaticDataStore.createObjects(data.rawHolidays, StaticDataHoliday)
            data.rawHolidays = null

            data.holidayIdToKeys = {}
            for (const [key, ids] of Object.entries(data.holidayIds)) {
                for (const id of ids) {
                    data.holidayIdToKeys[id] ||= []
                    if (data.holidayIdToKeys[id].indexOf(key) === -1) {
                        data.holidayIdToKeys[id].push(key)
                    }
                }
            }
        }

        data.heirloomsById = Object.fromEntries(data.heirlooms.map((heirloom) => [heirloom.id, heirloom]))
        data.heirloomsByItemId = Object.fromEntries(data.heirlooms.map((heirloom) => [heirloom.itemId, heirloom]))

        if (data.instancesRaw !== null) {
            data.instances = StaticDataStore.createObjects(data.instancesRaw, StaticDataInstance)
            data.instancesRaw = null

            for (const instanceId in extraInstanceMap) {
                data.instances[instanceId] = extraInstanceMap[instanceId]
            }
        }

        if (data.rawRealms !== null) {
            data.realms = {
                0: new StaticDataRealm(0, 1, 0, 'Honkstrasza', 'honkstrasza'),
                100001: new StaticDataRealm(100001, 1, 100001, 'Commodities', 'commodities'),
                100002: new StaticDataRealm(100002, 2, 100002, 'Commodities', 'commodities'),
                100003: new StaticDataRealm(100003, 3, 100003, 'Commodities', 'commodities'),
                100004: new StaticDataRealm(100004, 4, 100004, 'Commodities', 'commodities'),
            }
            for (const realmArray of data.rawRealms) {
                const obj = new StaticDataRealm(...realmArray)
                data.realms[obj.id] = obj

            }
            data.rawRealms = null
        }

        if (data.rawReputations !== null) {
            data.reputations = StaticDataStore.createObjects(data.rawReputations, StaticDataReputation)
            data.rawReputations = null
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
            data.toysById = Object.fromEntries(
                Object.values(data.toys)
                    .map((toy) => [toy.id, toy])
            )
            data.rawToys = null
        }

        if (data.rawTransmogSets !== null) {
            data.transmogSets = StaticDataStore.createObjects(data.rawTransmogSets, StaticDataTransmogSet, (set) => set.id)
            data.rawTransmogSets = null
        }

        console.timeEnd('StaticDataStore.initialize')
    }

    setup(settings: Settings) {
        this.value.connectedRealms = {}

        const connected: Record<number, { region: number, names: string[] }> = {}
        for (const realm of Object.values(this.value.realms)) {
            if (settings?.general?.useEnglishRealmNames !== false && realm.englishName) {
                realm.name = realm.englishName
            }

            if (realm.connectedRealmId > 0) {
                connected[realm.connectedRealmId] ||= {
                    region: realm.region,
                    names: [],
                }
                connected[realm.connectedRealmId].names.push(realm.name)
            }
        }

        for (const [crId, {region, names}] of Object.entries(connected)) {
            names.sort()
            this.value.connectedRealms[parseInt(crId)] = {
                id: parseInt(crId),
                region: region,
                displayText: names.join(' / '),
                realmNames: names,
            }
        }
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
