import type {
    StaticDataBag,
    StaticDataBagArray,
    StaticDataCampaign,
    StaticDataCampaignArray,
    StaticDataCharacterClass,
    StaticDataCharacterRace,
    StaticDataCharacterSpecialization,
    StaticDataConnectedRealm,
    StaticDataCurrency,
    StaticDataCurrencyArray,
    StaticDataCurrencyCategory,
    StaticDataCurrencyCategoryArray,
    StaticDataHoliday,
    StaticDataHolidayArray,
    StaticDataInstance,
    StaticDataInstanceArray,
    StaticDataKeystoneAffix,
    StaticDataMount,
    StaticDataMountArray,
    StaticDataPet,
    StaticDataPetArray,
    StaticDataQuestInfo,
    StaticDataQuestInfoArray,
    StaticDataQuestLine,
    StaticDataQuestLineArray,
    StaticDataRealm,
    StaticDataRealmArray,
    StaticDataReputation,
    StaticDataReputationArray,
    StaticDataReputationTier,
    StaticDataToy,
    StaticDataToyArray,
    StaticDataTransmogSet,
    StaticDataTransmogSetArray,
    StaticDataWorldQuest,
    StaticDataWorldQuestArray,
} from '../../static/types';

export interface RawStatic {
    characterClasses: Record<number, StaticDataCharacterClass>;
    characterRaces: Record<number, StaticDataCharacterRace>;
    characterSpecializations: Record<number, StaticDataCharacterSpecialization>;
    keystoneAffixes: Record<number, StaticDataKeystoneAffix>;
    questNames: Record<number, string>;
    reputationTiers: Record<number, StaticDataReputationTier>;

    rawBags: StaticDataBagArray[];
    rawCampaigns: StaticDataCampaignArray[];
    rawCurrencies: StaticDataCurrencyArray[];
    rawCurrencyCategories: StaticDataCurrencyCategoryArray[];
    rawHolidays: StaticDataHolidayArray[];
    instancesRaw: StaticDataInstanceArray[];
    rawMounts: StaticDataMountArray[];
    rawPets: StaticDataPetArray[];
    rawQuestInfo: StaticDataQuestInfoArray[];
    rawQuestLines: StaticDataQuestLineArray[];
    rawRealms: StaticDataRealmArray[];
    rawReputations: StaticDataReputationArray[];
    rawToys: StaticDataToyArray[];
    rawTransmogSets: StaticDataTransmogSetArray[];
    rawWorldQuests: StaticDataWorldQuestArray[];
}

export class DataStatic {
    // Copy
    public characterClassById: Map<number, StaticDataCharacterClass>;
    public characterRaceById: Map<number, StaticDataCharacterRace>;
    public characterSpecializationById: Map<number, StaticDataCharacterSpecialization>;
    public keystoneAffixById: Map<number, StaticDataKeystoneAffix>;
    public questNameById: Map<number, string>;
    public reputationTierById: Map<number, StaticDataReputationTier>;

    // Raw
    public bagById: Map<number, StaticDataBag>;
    public campaignById: Map<number, StaticDataCampaign>;
    public currencyById: Map<number, StaticDataCurrency>;
    public currencyCategoryById: Map<number, StaticDataCurrencyCategory>;
    public holidayById: Map<number, StaticDataHoliday>;
    public instanceById: Map<number, StaticDataInstance>;
    public mountById: Map<number, StaticDataMount>;
    public petById: Map<number, StaticDataPet>;
    public questInfoById: Map<number, StaticDataQuestInfo>;
    public questLineById: Map<number, StaticDataQuestLine>;
    public realmById: Map<number, StaticDataRealm>;
    public reputationById: Map<number, StaticDataReputation>;
    public toyById: Map<number, StaticDataToy>;
    public transmogSetById: Map<number, StaticDataTransmogSet>;
    public worldQuestById: Map<number, StaticDataWorldQuest>;

    // Calculate
    public characterClassBySlug = new Map<string, StaticDataCharacterClass>();
    public characterRaceBySlug = new Map<string, StaticDataCharacterRace>();
    public characterSpecializationsByClassId = new Map<
        number,
        StaticDataCharacterSpecialization[]
    >();
    public connectedRealmById = new Map<number, StaticDataConnectedRealm>();
    public mountByItemId = new Map<number, StaticDataMount>();
    public petByItemId = new Map<number, StaticDataPet>();
    public toyByItemId = new Map<number, StaticDataToy>();
}
