import cloneDeep from 'lodash/cloneDeep';

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
    StaticDataQuestInfo,
    StaticDataQuestLine,
    StaticDataRealm,
    StaticDataReputation,
    StaticDataToy,
    StaticDataTransmogSet,
    StaticDataWorldQuest,
} from '../../static/types';
import { DataStatic, type RawStatic } from './types';

export function processStaticData(rawData: RawStatic): DataStatic {
    console.time('processStaticData');

    const data = new DataStatic();

    data.characterClassById = new Map(getNumberKeyedEntries(cloneDeep(rawData.characterClasses)));
    data.characterRaceById = new Map(getNumberKeyedEntries(cloneDeep(rawData.characterRaces)));
    data.characterSpecializationById = new Map(
        getNumberKeyedEntries(cloneDeep(rawData.characterSpecializations))
    );
    data.keystoneAffixById = new Map(getNumberKeyedEntries(cloneDeep(rawData.keystoneAffixes)));
    data.questNameById = new Map(getNumberKeyedEntries(cloneDeep(rawData.questNames)));
    data.reputationTierById = new Map(getNumberKeyedEntries(cloneDeep(rawData.reputationTiers)));

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
    data.questInfoById = createObjects(rawData.rawQuestInfo, StaticDataQuestInfo);
    data.questLineById = createObjects(rawData.rawQuestLines, StaticDataQuestLine);
    data.realmById = createObjects(rawData.rawRealms, StaticDataRealm);
    data.reputationById = createObjects(rawData.rawReputations, StaticDataReputation);
    data.toyById = createObjects(rawData.rawToys, StaticDataToy);
    data.transmogSetById = createObjects(rawData.rawTransmogSets, StaticDataTransmogSet);
    data.worldQuestById = createObjects(rawData.rawWorldQuests, StaticDataWorldQuest);

    for (const characterClass of data.characterClassById.values()) {
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
