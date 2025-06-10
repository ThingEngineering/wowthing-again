import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
import {
    StaticDataProfessionAbilityInfo,
    type StaticDataBag,
    type StaticDataBagArray,
    type StaticDataCampaign,
    type StaticDataCampaignArray,
    type StaticDataCharacterClass,
    type StaticDataCharacterRace,
    type StaticDataCharacterSpecialization,
    type StaticDataConnectedRealm,
    type StaticDataCurrency,
    type StaticDataCurrencyArray,
    type StaticDataCurrencyCategory,
    type StaticDataCurrencyCategoryArray,
    type StaticDataHeirloom,
    type StaticDataHoliday,
    type StaticDataHolidayArray,
    type StaticDataIllusion,
    type StaticDataInstance,
    type StaticDataInstanceArray,
    type StaticDataKeystoneAffix,
    type StaticDataMount,
    type StaticDataMountArray,
    type StaticDataPet,
    type StaticDataPetArray,
    type StaticDataProfession,
    type StaticDataProfessionArray,
    type StaticDataProfessionCategory,
    type StaticDataQuestInfo,
    type StaticDataQuestInfoArray,
    type StaticDataQuestLine,
    type StaticDataQuestLineArray,
    type StaticDataRealm,
    type StaticDataRealmArray,
    type StaticDataReputation,
    type StaticDataReputationArray,
    type StaticDataReputationTier,
    type StaticDataToy,
    type StaticDataToyArray,
    type StaticDataTransmogSet,
    type StaticDataTransmogSetArray,
    type StaticDataWorldQuest,
    type StaticDataWorldQuestArray,
} from '../../static/types';
import { wowthingData } from '../store.svelte';

export interface RawStatic {
    characterClasses: Record<number, StaticDataCharacterClass>;
    characterRaces: Record<number, StaticDataCharacterRace>;
    characterSpecializations: Record<number, StaticDataCharacterSpecialization>;
    heirlooms: Record<number, StaticDataHeirloom>;
    illusions: Record<number, StaticDataIllusion>;
    inventorySlots: Record<number, string>;
    inventoryTypes: Record<number, string>;
    keystoneAffixes: Record<number, StaticDataKeystoneAffix>;
    questNames: Record<number, string>;
    reagentCategories: Record<number, number[]>;
    reputationTiers: Record<number, StaticDataReputationTier>;
    sharedStrings: Record<number, string>;

    rawBags: StaticDataBagArray[];
    rawCampaigns: StaticDataCampaignArray[];
    rawCurrencies: StaticDataCurrencyArray[];
    rawCurrencyCategories: StaticDataCurrencyCategoryArray[];
    rawHolidays: StaticDataHolidayArray[];
    instancesRaw: StaticDataInstanceArray[];
    rawMounts: StaticDataMountArray[];
    rawPets: StaticDataPetArray[];
    rawProfessions: StaticDataProfessionArray[];
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
    public heirloomById: Map<number, StaticDataHeirloom>;
    public illusionById: Map<number, StaticDataIllusion>;
    public inventorySlotById: Map<number, string>;
    public inventoryTypeById: Map<number, string>;
    public keystoneAffixById: Map<number, StaticDataKeystoneAffix>;
    public questNameById: Map<number, string>;
    public reagentCategoriesById: Map<number, number[]>;
    public reputationTierById: Map<number, StaticDataReputationTier>;
    public sharedStringById: Map<number, string>;

    // Raw
    public bagById: Map<number, StaticDataBag>;
    public campaignById: Map<number, StaticDataCampaign>;
    public currencyById: Map<number, StaticDataCurrency>;
    public currencyCategoryById: Map<number, StaticDataCurrencyCategory>;
    public holidayById: Map<number, StaticDataHoliday>;
    public instanceById: Map<number, StaticDataInstance>;
    public mountById: Map<number, StaticDataMount>;
    public petById: Map<number, StaticDataPet>;
    public professionById: Map<number, StaticDataProfession>;
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
    public heirloomByItemId = new Map<number, StaticDataHeirloom>();
    public illusionByEnchantmentId = new Map<number, StaticDataIllusion>();
    public keystoneAffixBySlug = new Map<string, StaticDataKeystoneAffix>();
    public mountByItemId = new Map<number, StaticDataMount>();
    public petByItemId = new Map<number, StaticDataPet>();
    public professionAbilityByAbilityId = new Map<number, StaticDataProfessionAbilityInfo>();
    public professionAbilityByItemId = new Map<number, StaticDataProfessionAbilityInfo>();
    public professionAbilityBySpellId = new Map<number, StaticDataProfessionAbilityInfo>();
    public professionBySkillLineId = new Map<number, [StaticDataProfession, number]>();
    public professionBySlug = new Map<string, StaticDataProfession>();
    public toyByItemId = new Map<number, StaticDataToy>();

    // Professions eh
    public buildProfessionData() {
        const spellToItem: Record<number, number[]> = {};
        for (const [itemId, spellIds] of getNumberKeyedEntries(wowthingData.items.teachesSpell)) {
            for (const spellId of spellIds) {
                (spellToItem[spellId] ||= []).push(itemId);
            }
        }

        for (const profession of this.professionById.values()) {
            this.professionBySkillLineId.set(profession.id, [profession, 0]);
            this.professionBySlug.set(profession.slug, profession);

            for (let i = 0; i < profession.subProfessions.length; i++) {
                this.professionBySkillLineId.set(profession.subProfessions[i].id, [profession, i]);

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
                const abilityInfo = this.professionAbilityBySpellId.get(spellId);
                if (abilityInfo) {
                    if (!this.professionAbilityByItemId.has(itemId)) {
                        this.professionAbilityByItemId.set(itemId, abilityInfo);
                    }
                    if (!this.professionAbilityBySpellId.has(spellId)) {
                        this.professionAbilityBySpellId.set(spellId, abilityInfo);
                    }
                }
            }
        }
    }

    private recurseProfession(
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
            this.professionAbilityByAbilityId.set(abililtyInfo.abilityId, abililtyInfo);
            this.professionAbilityBySpellId.set(abililtyInfo.spellId, abililtyInfo);

            for (const itemId of abililtyInfo.itemIds || []) {
                this.professionAbilityByItemId.set(itemId, abililtyInfo);
            }
        }

        for (const childCategory of category.children) {
            this.recurseProfession(childCategory, professionId, subProfessionId, spellToItem);
        }
    }
}
