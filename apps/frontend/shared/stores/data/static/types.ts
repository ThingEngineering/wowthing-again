import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
import {
    StaticDataDecorCategory,
    StaticDataProfessionAbilityInfo,
    type StaticDataBag,
    type StaticDataBagArray,
    type StaticDataCampaign,
    type StaticDataCampaignArray,
    type StaticDataChallengeDungeon,
    type StaticDataChallengeDungeonArray,
    type StaticDataCharacterClass,
    type StaticDataCharacterRace,
    type StaticDataCharacterSpecialization,
    type StaticDataConnectedRealm,
    type StaticDataCurrency,
    type StaticDataCurrencyArray,
    type StaticDataCurrencyCategory,
    type StaticDataCurrencyCategoryArray,
    type StaticDataDecorCategoryArray,
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
import type { StaticDataEnchantment } from '../../static/types/enchantment';
import type { StaticDataArtifact } from '../../static/types/artifact';

export interface RawStatic {
    artifacts: StaticDataArtifact[];
    characterClasses: Record<number, StaticDataCharacterClass>;
    characterRaces: Record<number, StaticDataCharacterRace>;
    characterSpecializations: Record<number, StaticDataCharacterSpecialization>;
    enchantments: Record<number, StaticDataEnchantment>;
    enchantmentStrings: Record<string, number[]>;
    enchantmentValues: Record<number, number[]>;
    heirlooms: Record<number, StaticDataHeirloom>;
    holidayIds: Record<string, number[]>;
    illusions: Record<number, StaticDataIllusion>;
    inventorySlots: Record<number, string>;
    inventoryTypes: Record<number, string>;
    itemToRequiredAbility: Record<number, number>; // hardcoded
    itemToSkillLine: Record<number, [number, number]>; // [requiredSkill, requiredSkillRank]
    keystoneAffixes: Record<number, StaticDataKeystoneAffix>;
    questNames: Record<number, string>;
    reagentCategories: Record<number, number[]>;
    reputationTiers: Record<number, StaticDataReputationTier>;
    sharedStrings: Record<number, string>;
    skillLineAbilityItems: Record<number, number[]>; // skillLineId -> [itemIds]

    rawBags: StaticDataBagArray[];
    rawCampaigns: StaticDataCampaignArray[];
    rawChallengeDungeons: StaticDataChallengeDungeonArray[];
    rawCurrencies: StaticDataCurrencyArray[];
    rawCurrencyCategories: StaticDataCurrencyCategoryArray[];
    rawDecor: StaticDataDecorCategoryArray[];
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
    public artifactBySpecializationId: Map<number, StaticDataArtifact>;
    public characterClassById: Map<number, StaticDataCharacterClass>;
    public characterRaceById: Map<number, StaticDataCharacterRace>;
    public characterSpecializationById: Map<number, StaticDataCharacterSpecialization>;
    public heirloomById: Map<number, StaticDataHeirloom>;
    public holidayIds = new Map<string, number[]>();
    public illusionById: Map<number, StaticDataIllusion>;
    public inventorySlotById: Map<number, string>;
    public inventoryTypeById: Map<number, string>;
    public keystoneAffixById: Map<number, StaticDataKeystoneAffix>;
    public questNameById: Map<number, string>;
    public reagentCategoriesById: Map<number, number[]>;
    public reputationTierById: Map<number, StaticDataReputationTier>;
    public sharedStringById: Map<number, string>;

    public itemToRequiredAbility: Record<number, number>; // hardcoded
    public itemToSkillLine: Record<number, [number, number]>; // [requiredSkill, requiredSkillRank]
    public skillLineAbilityItems: Record<number, number[]>; // skillLineId -> [itemIds]

    // Raw
    public decorCategories: StaticDataDecorCategory[];

    public bagById: Map<number, StaticDataBag>;
    public campaignById: Map<number, StaticDataCampaign>;
    public challengeDungeonById: Map<number, StaticDataChallengeDungeon>;
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
    public transmogSetsByGroupId: Map<number, StaticDataTransmogSet[]>;
    public worldQuestById: Map<number, StaticDataWorldQuest>;

    // Calculate
    public characterClassBySlug = new Map<string, StaticDataCharacterClass>();
    public characterRaceBySlug = new Map<string, StaticDataCharacterRace>();
    public characterSpecializationsByClassId = new Map<
        number,
        StaticDataCharacterSpecialization[]
    >();
    public connectedRealmById = new Map<number, StaticDataConnectedRealm>();
    public currencyCategoryBySlug = new Map<string, StaticDataCurrencyCategory>();
    public enchantmentById = new Map<number, StaticDataEnchantment>();
    public heirloomByItemId = new Map<number, StaticDataHeirloom>();
    public holidayIdToKeys = new Map<number, string[]>();
    public illusionByEnchantmentId = new Map<number, StaticDataIllusion>();
    public keystoneAffixBySlug = new Map<string, StaticDataKeystoneAffix>();
    public mountByItemId = new Map<number, StaticDataMount>();
    public petByItemId = new Map<number, StaticDataPet>();
    public professionAbilityByAbilityId = new Map<number, StaticDataProfessionAbilityInfo>();
    public professionAbilityByItemId = new Map<number, StaticDataProfessionAbilityInfo>();
    public professionAbilityBySpellId = new Map<number, StaticDataProfessionAbilityInfo>();
    public professionBySkillLineId = new Map<number, [StaticDataProfession, number]>();
    public professionBySlug = new Map<string, StaticDataProfession>();
    public requiredProfessionByItemId = new Map<number, number>();
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
                const subProfession = profession.subProfessions[i];
                this.professionBySkillLineId.set(subProfession.id, [profession, i]);

                this.recurseProfession(
                    profession.categories[i],
                    profession.id,
                    subProfession.id,
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

        // ??
        for (const [itemId, [requiredSkillId]] of getNumberKeyedEntries(
            wowthingData.items.itemRequiredSkills
        )) {
            const [profession] = this.professionBySkillLineId.get(requiredSkillId) || [];
            if (profession) {
                this.requiredProfessionByItemId.set(itemId, profession.id);
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
