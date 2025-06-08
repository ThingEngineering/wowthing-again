import { extraInstanceMap } from '@/data/dungeon';
import { settingsState } from '@/shared/state/settings.svelte';
import { WritableFancyStore } from '@/types';
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
import {
    StaticDataBag,
    StaticDataCampaign,
    StaticDataCurrency,
    StaticDataCurrencyCategory,
    StaticDataHoliday,
    StaticDataInstance,
    StaticDataMount,
    StaticDataPet,
    StaticDataProfessionCategory,
    StaticDataRealm,
    StaticDataReputation,
    StaticDataToy,
    StaticDataTransmogSet,
    StaticDataWorldQuest,
} from './types';
import { StaticDataProfessionAbilityInfo, type StaticData } from './types';
import { StaticDataQuestInfo } from './types/quest-info';
import { StaticDataQuestLine } from './types/quest-line';
import { StaticDataEnchantment } from './types/enchantment';
import { wowthingData } from '../data';

export class StaticDataStore extends WritableFancyStore<StaticData> {
    get dataUrl(): string {
        return document.getElementById('app').getAttribute('data-static');
    }

    initialize(data: StaticData): void {
        console.time('StaticDataStore.initialize');

        // data.characterClassesBySlug = {};
        // for (const cls of Object.values(data.characterClasses)) {
        //     data.characterClassesBySlug[cls.slug] = cls;

        //     cls.mask = 2 ** (cls.id - 1);
        //     cls.specializationIds = [];

        //     const specs = Object.values(data.characterSpecializations).filter(
        //         (spec) => spec.classId === cls.id
        //     );
        //     specs.sort((a, b) => a.order - b.order);
        //     cls.specializationIds = specs.map((spec) => spec.id);
        // }

        // data.characterRacesBySlug = Object.fromEntries(
        //     Object.values(data.characterRaces).map((race) => [
        //         ['dracthyr', 'pandaren'].includes(race.slug)
        //             ? `${race.slug}${race.faction}`
        //             : race.slug,
        //         race,
        //     ])
        // );

        data.professionBySkillLine = {};
        for (const profession of Object.values(data.professions)) {
            if (profession.rawCategories != null) {
                profession.categories = profession.rawCategories.map(
                    (categoryArray) => new StaticDataProfessionCategory(...categoryArray)
                );

                profession.expansionCategory = Object.fromEntries(
                    profession.categories.map((cat, index) => [index, cat])
                );

                profession.rawCategories = null;
            }

            profession.expansionSubProfession = Object.fromEntries(
                profession.subProfessions.map((cat, index) => [index, cat])
            );

            data.professionBySkillLine[profession.id] = [profession, 0];
            for (let i = 0; i < profession.subProfessions.length; i++) {
                const subProfession = profession.subProfessions[i];
                data.professionBySkillLine[subProfession.id] = [profession, i];
            }
        }

        if (data.rawBags !== null) {
            data.bags = StaticDataStore.createObjects(data.rawBags, StaticDataBag);
            data.rawBags = null;
        }

        if (data.rawCampaigns !== null) {
            data.campaigns = StaticDataStore.createObjects(data.rawCampaigns, StaticDataCampaign);
            data.rawCampaigns = null;
        }

        if (data.rawCurrencies !== null) {
            data.currencies = StaticDataStore.createObjects(data.rawCurrencies, StaticDataCurrency);
            data.rawCurrencies = null;
        }

        if (data.rawCurrencyCategories !== null) {
            data.currencyCategories = StaticDataStore.createObjects(
                data.rawCurrencyCategories,
                StaticDataCurrencyCategory
            );
            data.rawCurrencyCategories = null;
        }

        if (data.enchantmentStrings !== null) {
            data.enchantments = {};

            for (const [enchantString, enchantIds] of Object.entries(data.enchantmentStrings)) {
                for (const enchantId of enchantIds) {
                    data.enchantments[enchantId] = new StaticDataEnchantment(enchantString);
                }
            }

            for (const [enchantId, enchantValues] of getNumberKeyedEntries(
                data.enchantmentValues
            )) {
                data.enchantments[enchantId] ||= new StaticDataEnchantment(`Enchant #${enchantId}`);
                data.enchantments[enchantId].values = enchantValues;
            }

            data.enchantmentStrings = null;
            data.enchantmentValues = null;
        }

        if (data.rawHolidays !== null) {
            data.holidays = StaticDataStore.createObjects(data.rawHolidays, StaticDataHoliday);
            data.rawHolidays = null;

            data.holidayIdToKeys = {};
            for (const [key, ids] of Object.entries(data.holidayIds)) {
                for (const id of ids) {
                    data.holidayIdToKeys[id] ||= [];
                    if (data.holidayIdToKeys[id].indexOf(key) === -1) {
                        data.holidayIdToKeys[id].push(key);
                    }
                }
            }
        }

        data.heirloomsById = Object.fromEntries(
            data.heirlooms.map((heirloom) => [heirloom.id, heirloom])
        );
        data.heirloomsByItemId = Object.fromEntries(
            data.heirlooms.map((heirloom) => [heirloom.itemId, heirloom])
        );

        if (data.instancesRaw !== null) {
            data.instances = StaticDataStore.createObjects(data.instancesRaw, StaticDataInstance);
            data.instancesRaw = null;

            for (const instanceId in extraInstanceMap) {
                data.instances[instanceId] = extraInstanceMap[instanceId];
            }
        }

        if (data.rawQuestInfo) {
            data.questInfo = StaticDataStore.createObjects(data.rawQuestInfo, StaticDataQuestInfo);
            data.rawQuestInfo = null;
        }

        if (data.rawQuestLines !== null) {
            data.questLines = StaticDataStore.createObjects(
                data.rawQuestLines,
                StaticDataQuestLine
            );
            data.rawQuestLines = null;
        }

        if (data.rawRealms !== null) {
            data.realms = {
                0: new StaticDataRealm(0, 1, 0, 'Honkstrasza', 'honkstrasza', 'zzZZ'),
                100001: new StaticDataRealm(
                    100001,
                    1,
                    100001,
                    'Commodities',
                    'commodities',
                    'zzZZ'
                ),
                100002: new StaticDataRealm(
                    100002,
                    2,
                    100002,
                    'Commodities',
                    'commodities',
                    'zzZZ'
                ),
                100003: new StaticDataRealm(
                    100003,
                    3,
                    100003,
                    'Commodities',
                    'commodities',
                    'zzZZ'
                ),
                100004: new StaticDataRealm(
                    100004,
                    4,
                    100004,
                    'Commodities',
                    'commodities',
                    'zzZZ'
                ),
            };
            for (const realmArray of data.rawRealms) {
                const obj = new StaticDataRealm(...realmArray);
                data.realms[obj.id] = obj;
            }
            data.rawRealms = null;
        }

        if (data.rawReputations !== null) {
            data.reputations = StaticDataStore.createObjects(
                data.rawReputations,
                StaticDataReputation
            );
            data.rawReputations = null;
        }

        if (data.rawMounts !== null) {
            data.mounts = {};
            data.mountsByItem = {};
            data.mountsBySpell = {};
            for (const mountArray of data.rawMounts) {
                const obj = new StaticDataMount(...mountArray);
                data.mounts[obj.id] = obj;
                for (const itemId of obj.itemIds || []) {
                    data.mountsByItem[itemId] = obj;
                }
                if (obj.spellId) {
                    data.mountsBySpell[obj.spellId] = obj;
                }
            }
            data.rawMounts = null;
        }

        if (data.rawPets !== null) {
            data.pets = {};
            data.petsByItem = {};
            data.petsByName = {};
            for (const petArray of data.rawPets) {
                const obj = new StaticDataPet(...petArray);
                data.pets[obj.id] = obj;
                data.petsByName[obj.name] = obj;

                for (const itemId of obj.itemIds || []) {
                    data.petsByItem[itemId] = obj;
                }
            }
            data.rawPets = null;
        }

        if (data.rawToys !== null) {
            data.toys = StaticDataStore.createObjects(
                data.rawToys,
                StaticDataToy,
                (toy) => toy.itemId
            );
            data.toysById = Object.fromEntries(
                Object.values(data.toys).map((toy) => [toy.id, toy])
            );
            data.rawToys = null;
        }

        if (data.rawTransmogSets !== null) {
            data.transmogSets = StaticDataStore.createObjects(
                data.rawTransmogSets,
                StaticDataTransmogSet,
                (set) => set.id
            );
            data.rawTransmogSets = null;
        }

        if (data.rawWorldQuests != null) {
            data.worldQuests = StaticDataStore.createObjects(
                data.rawWorldQuests,
                StaticDataWorldQuest,
                (wq) => wq.id
            );
            data.rawWorldQuests = null;
        }

        console.timeEnd('StaticDataStore.initialize');
    }

    setup() {
        this.value.connectedRealms = {};

        const connected: Record<number, { region: number; locale: string; names: string[] }> = {};
        for (const realm of Object.values(this.value.realms)) {
            if (settingsState.value?.general?.useEnglishRealmNames !== false && realm.englishName) {
                realm.name = realm.englishName;
            }

            if (realm.connectedRealmId > 0) {
                connected[realm.connectedRealmId] ||= {
                    region: realm.region,
                    locale: realm.locale,
                    names: [],
                };
                connected[realm.connectedRealmId].names.push(realm.name);
            }
        }

        for (const [crId, { locale, names, region }] of Object.entries(connected)) {
            names.sort();
            this.value.connectedRealms[parseInt(crId)] = {
                id: parseInt(crId),
                region: region,
                displayText: names.join(' / '),
                locale: locale,
                realmNames: names,
            };
        }

        this.value.professionAbilityByAbilityId = {};
        this.value.professionAbilityByItemId = {};
        this.value.professionAbilityBySpellId = {};

        const spellToItem: Record<number, number[]> = {};
        for (const [itemId, spellIds] of Object.entries(wowthingData.items.teachesSpell)) {
            for (const spellId of spellIds) {
                (spellToItem[spellId] ||= []).push(parseInt(itemId));
            }
        }

        for (const profession of Object.values(this.value.professions)) {
            for (let i = 0; i < profession.subProfessions.length; i++) {
                this.recurseProfession(
                    profession.categories[i],
                    profession.id,
                    profession.subProfessions[i].id,
                    spellToItem
                );
            }
        }

        // map learned spells to ability info
        // TODO: do something about items that teach multiple spells
        for (const [itemId, spellIds] of getNumberKeyedEntries(wowthingData.items.teachesSpell)) {
            for (const spellId of spellIds) {
                const abilityInfo = this.value.professionAbilityBySpellId[spellId];
                if (abilityInfo) {
                    this.value.professionAbilityByItemId[itemId] ||= abilityInfo;
                    this.value.professionAbilityBySpellId[spellId] ||= abilityInfo;
                }
            }
        }
    }

    recurseProfession(
        category: StaticDataProfessionCategory,
        professionId: number,
        subProfessionId: number,
        spellToItem: Record<number, number[]>
    ) {
        const data: StaticDataProfessionAbilityInfo[] = [];

        for (const ability of category.abilities) {
            data.push(
                new StaticDataProfessionAbilityInfo(
                    professionId,
                    subProfessionId,
                    ability,
                    ability.id,
                    ability.itemIds,
                    ability.spellId
                )
            );

            for (const [extraAbilityId, extraSpellId] of ability.extraRanks || []) {
                const extraItemId = spellToItem[extraSpellId];
                if (extraItemId) {
                    data.push(
                        new StaticDataProfessionAbilityInfo(
                            professionId,
                            subProfessionId,
                            ability,
                            extraAbilityId,
                            extraItemId,
                            extraSpellId
                        )
                    );
                }
            }
        }

        for (const abililtyInfo of data) {
            this.value.professionAbilityByAbilityId[abililtyInfo.abilityId] = abililtyInfo;
            this.value.professionAbilityBySpellId[abililtyInfo.spellId] = abililtyInfo;

            for (const itemId of abililtyInfo.itemIds || []) {
                this.value.professionAbilityByItemId[itemId] = abililtyInfo;
            }
        }

        for (const childCategory of category.children) {
            this.recurseProfession(childCategory, professionId, subProfessionId, spellToItem);
        }
    }

    private static createObjects<TObject extends { id: number }, TArgs extends unknown[]>(
        arrays: TArgs[],
        objectConstructor: { new (...args: TArgs): TObject },
        idFunc: (obj: TObject) => number = null
    ): Record<number, TObject> {
        const ret: Record<number, TObject> = {};

        for (const array of arrays) {
            const obj = new objectConstructor(...array);
            ret[idFunc?.(obj) ?? obj.id] = obj;
        }
        return ret;
    }
}

export const staticStore = new StaticDataStore();
