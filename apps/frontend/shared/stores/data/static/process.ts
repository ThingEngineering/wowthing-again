import cloneDeep from 'lodash/cloneDeep';

import { extraInstances } from '@/data/dungeon';
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
import {
    StaticDataBag,
    StaticDataCampaign,
    StaticDataConnectedRealm,
    StaticDataCurrency,
    StaticDataCurrencyCategory,
    StaticDataHoliday,
    StaticDataInstance,
    StaticDataMount,
    StaticDataPet,
    StaticDataProfession,
    StaticDataQuestInfo,
    StaticDataQuestLine,
    StaticDataRealm,
    StaticDataReputation,
    StaticDataToy,
    StaticDataTransmogSet,
    StaticDataWorldQuest,
} from '../../static/types';
import { DataStatic, type RawStatic } from './types';
import { StaticDataEnchantment } from '../../static/types/enchantment';

export function processStaticData(rawData: RawStatic): DataStatic {
    console.time('processStaticData');

    const data = new DataStatic();

    data.characterClassById = new Map(getNumberKeyedEntries(cloneDeep(rawData.characterClasses)));
    data.characterRaceById = new Map(getNumberKeyedEntries(cloneDeep(rawData.characterRaces)));
    data.characterSpecializationById = new Map(
        getNumberKeyedEntries(cloneDeep(rawData.characterSpecializations))
    );
    data.heirloomById = new Map(getNumberKeyedEntries(cloneDeep(rawData.heirlooms)));
    data.holidayIds = new Map(Object.entries(cloneDeep(rawData.holidayIds)));
    data.illusionById = new Map(getNumberKeyedEntries(cloneDeep(rawData.illusions)));
    data.inventorySlotById = new Map(getNumberKeyedEntries(cloneDeep(rawData.inventorySlots)));
    data.inventoryTypeById = new Map(getNumberKeyedEntries(cloneDeep(rawData.inventoryTypes)));
    data.keystoneAffixById = new Map(getNumberKeyedEntries(cloneDeep(rawData.keystoneAffixes)));
    data.questNameById = new Map(getNumberKeyedEntries(cloneDeep(rawData.questNames)));
    data.reagentCategoriesById = new Map(
        getNumberKeyedEntries(cloneDeep(rawData.reagentCategories))
    );
    data.reputationTierById = new Map(getNumberKeyedEntries(cloneDeep(rawData.reputationTiers)));
    data.sharedStringById = new Map(getNumberKeyedEntries(cloneDeep(rawData.sharedStrings)));

    data.itemToRequiredAbility = cloneDeep(rawData.itemToRequiredAbility);
    data.itemToSkillLine = cloneDeep(rawData.itemToSkillLine);
    data.skillLineAbilityItems = cloneDeep(rawData.skillLineAbilityItems);

    data.bagById = createObjects(rawData.rawBags, StaticDataBag);
    data.campaignById = createObjects(rawData.rawCampaigns, StaticDataCampaign);
    data.currencyById = createObjects(rawData.rawCurrencies, StaticDataCurrency);
    data.currencyCategoryById = createObjects(
        rawData.rawCurrencyCategories,
        StaticDataCurrencyCategory
    );
    data.holidayById = createObjects(rawData.rawHolidays, StaticDataHoliday);
    data.instanceById = createObjects(rawData.instancesRaw, StaticDataInstance);
    data.mountById = createObjects(rawData.rawMounts, StaticDataMount);
    data.petById = createObjects(rawData.rawPets, StaticDataPet);
    data.professionById = createObjects(rawData.rawProfessions, StaticDataProfession);
    data.questInfoById = createObjects(rawData.rawQuestInfo, StaticDataQuestInfo);
    data.questLineById = createObjects(rawData.rawQuestLines, StaticDataQuestLine);
    data.realmById = createObjects(rawData.rawRealms, StaticDataRealm);
    data.reputationById = createObjects(rawData.rawReputations, StaticDataReputation);
    data.toyById = createObjects(rawData.rawToys, StaticDataToy);
    data.transmogSetById = createObjects(rawData.rawTransmogSets, StaticDataTransmogSet);
    data.worldQuestById = createObjects(rawData.rawWorldQuests, StaticDataWorldQuest);

    // Enchantments are weird
    for (const [enchantString, enchantIds] of Object.entries(rawData.enchantmentStrings)) {
        for (const enchantId of enchantIds) {
            data.enchantmentById.set(enchantId, new StaticDataEnchantment(enchantString));
        }
    }

    for (const [enchantId, enchantValues] of getNumberKeyedEntries(rawData.enchantmentValues)) {
        if (!data.enchantmentById.has(enchantId)) {
            data.enchantmentById.set(enchantId, new StaticDataEnchantment(`Enchant #${enchantId}`));
        }
        data.enchantmentById.get(enchantId).values = enchantValues;
    }

    // Extra instances
    for (const instance of extraInstances) {
        data.instanceById.set(instance.id, instance);
    }

    // Extra mappings
    for (const characterClass of data.characterClassById.values()) {
        // FIXME: precalculate these in StaticTool
        characterClass.mask = 2 ** (characterClass.id - 1);
        characterClass.specializationIds = [];

        const specs = Array.from(data.characterSpecializationById.values()).filter(
            (spec) => spec.classId === characterClass.id
        );
        specs.sort((a, b) => a.order - b.order);
        characterClass.specializationIds = specs.map((spec) => spec.id);

        data.characterClassBySlug.set(characterClass.slug, characterClass);
    }

    for (const characterRace of data.characterRaceById.values()) {
        data.characterRaceBySlug.set(characterRace.slug, characterRace);
    }

    for (const characterSpecialization of data.characterSpecializationById.values()) {
        if (!data.characterSpecializationsByClassId.has(characterSpecialization.classId)) {
            data.characterSpecializationsByClassId.set(characterSpecialization.classId, []);
        }
        data.characterSpecializationsByClassId
            .get(characterSpecialization.classId)
            .push(characterSpecialization);
    }

    for (const currencyCategory of data.currencyCategoryById.values()) {
        data.currencyCategoryBySlug.set(currencyCategory.slug, currencyCategory);
    }

    for (const heirloom of data.heirloomById.values()) {
        data.heirloomByItemId.set(heirloom.itemId, heirloom);
    }

    for (const [key, ids] of data.holidayIds.entries()) {
        for (const id of ids) {
            if (!data.holidayIdToKeys.has(id)) {
                data.holidayIdToKeys.set(id, []);
            }
            const keys = data.holidayIdToKeys.get(id);
            if (keys.indexOf(key) === -1) {
                keys.push(key);
            }
        }
    }

    for (const illusion of data.illusionById.values()) {
        data.illusionByEnchantmentId.set(illusion.enchantmentId, illusion);
    }

    for (const keystoneAffix of data.keystoneAffixById.values()) {
        data.keystoneAffixBySlug.set(keystoneAffix.slug, keystoneAffix);
    }

    for (const mount of data.mountById.values()) {
        for (const itemId of mount.itemIds) {
            data.mountByItemId.set(itemId, mount);
        }
    }

    for (const pet of data.petById.values()) {
        for (const itemId of pet.itemIds) {
            data.petByItemId.set(itemId, pet);
        }
    }

    for (const toy of data.toyById.values()) {
        if (toy.itemId > 0) {
            data.toyByItemId.set(toy.itemId, toy);
        }
    }

    // Realms are fun
    data.realmById.set(0, new StaticDataRealm(0, 1, 0, 'Honkstrasza', 'honkstrasza', 'zzZZ'));
    data.realmById.set(
        100001,
        new StaticDataRealm(100001, 1, 100001, 'Commodities', 'commodities', 'zzZZ')
    );
    data.realmById.set(
        100002,
        new StaticDataRealm(100002, 2, 100002, 'Commodities', 'commodities', 'zzZZ')
    );
    data.realmById.set(
        100003,
        new StaticDataRealm(100003, 3, 100003, 'Commodities', 'commodities', 'zzZZ')
    );
    data.realmById.set(
        100004,
        new StaticDataRealm(100004, 4, 100004, 'Commodities', 'commodities', 'zzZZ')
    );

    for (const realm of data.realmById.values()) {
        // if (settingsState.value?.general?.useEnglishRealmNames !== false && realm.englishName) {
        //     realm.name = realm.englishName;
        // }

        if (realm.connectedRealmId > 0) {
            let connectedRealm = data.connectedRealmById.get(realm.connectedRealmId);
            if (!connectedRealm) {
                connectedRealm = new StaticDataConnectedRealm(
                    realm.connectedRealmId,
                    realm.region,
                    realm.locale
                );
                data.connectedRealmById.set(realm.connectedRealmId, connectedRealm);
            }
            connectedRealm.realmNames.push(realm.name);
        }
    }

    for (const connectedRealm of data.connectedRealmById.values()) {
        connectedRealm.realmNames.sort();
        connectedRealm.displayText = connectedRealm.realmNames.join(' / ');
    }

    console.timeEnd('processStaticData');

    return data;
}

function createObjects<TObject extends { id: number }, TArgs extends unknown[]>(
    arrays: TArgs[],
    objectConstructor: { new (...args: TArgs): TObject }
): Map<number, TObject> {
    const ret = new Map<number, TObject>();
    for (const array of arrays) {
        const obj = new objectConstructor(...array);
        ret.set(obj.id, obj);
    }
    return ret;
}
