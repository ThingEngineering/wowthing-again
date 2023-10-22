import type { StaticDataBag, StaticDataBagArray } from './bag'
import type { StaticDataCharacterClass, StaticDataCharacterRace, StaticDataCharacterSpecialization } from './character'
import type { StaticDataCurrency, StaticDataCurrencyArray, StaticDataCurrencyCategory, StaticDataCurrencyCategoryArray } from './currency'
import type { StaticDataHeirloom } from './heirloom'
import type { StaticDataHoliday, StaticDataHolidayArray } from './holiday'
import type { StaticDataIllusion } from './illusion'
import type { StaticDataInstance, StaticDataInstanceArray } from './instance'
import type { StaticDataKeystoneAffix } from './keystone-affix'
import type { StaticDataMount, StaticDataMountArray } from './mount'
import type { StaticDataPet, StaticDataPetArray } from './pet'
import type { StaticDataProfession, StaticDataProfessionAbility } from './profession'
import type { StaticDataQuestInfo, StaticDataQuestInfoArray } from './quest-info'
import type { StaticDataConnectedRealm, StaticDataRealm, StaticDataRealmArray } from './realm'
import type { StaticDataReputation, StaticDataReputationArray, StaticDataReputationCategory, StaticDataReputationCategoryArray, StaticDataReputationTier } from './reputation'
import type { StaticDataSoulbind } from './soulbind'
import type { StaticDataToy, StaticDataToyArray } from './toy'
import type { StaticDataTransmogSet, StaticDataTransmogSetArray } from './transmog-set'
import type { StaticDataWorldQuest, StaticDataWorldQuestArray } from './world-quest'


export interface StaticData {
    connectedRealms: Record<number, StaticDataConnectedRealm>
    enchantments: Record<number, string>
    illusions: Record<number, StaticDataIllusion>
    inventorySlots: Record<number, string>
    inventoryTypes: Record<number, string>
    keystoneAffixes: Record<number, StaticDataKeystoneAffix>
    questNames: Record<number, string>
    sharedStrings: Record<number, string>
    soulbinds: Record<number, StaticDataSoulbind[]>
    talents: Record<number, number[][]>

    characterClasses: Record<number, StaticDataCharacterClass>
    characterClassesBySlug: Record<string, StaticDataCharacterClass>
    characterRaces: Record<number, StaticDataCharacterRace>
    characterRacesBySlug: Record<string, StaticDataCharacterRace>
    characterSpecializations: Record<number, StaticDataCharacterSpecialization>

    itemToRequiredAbility: Record<number, number>
    itemToSkillLine: Record<number, [number, number]>
    itemToSkillLineAbility: Record<number, number>
    professions: Record<number, StaticDataProfession>
    professionBySkillLine: Record<number, [StaticDataProfession, number]>
    skillLineAbilityItems: Record<number, number[]>
    spellToProfessionAbility: Record<number, StaticDataProfessionAbility>

    bags: Record<number, StaticDataBag>
    rawBags: StaticDataBagArray[]

    currencies: Record<number, StaticDataCurrency>
    rawCurrencies: StaticDataCurrencyArray[]

    currencyCategories: Record<number, StaticDataCurrencyCategory>
    rawCurrencyCategories: StaticDataCurrencyCategoryArray[]

    heirlooms: StaticDataHeirloom[]
    heirloomsById: Record<number, StaticDataHeirloom>
    heirloomsByItemId: Record<number, StaticDataHeirloom>

    holidays: Record<number, StaticDataHoliday>
    rawHolidays: StaticDataHolidayArray[]

    holidayIds: Record<string, number[]>
    holidayIdToKeys: Record<number, string[]>

    instances: Record<number, StaticDataInstance>
    instancesRaw: StaticDataInstanceArray[]

    mounts: Record<number, StaticDataMount>
    rawMounts: StaticDataMountArray[]

    pets: Record<number, StaticDataPet>
    petsByName: Record<string, StaticDataPet>
    rawPets: StaticDataPetArray[]

    questInfo: Record<number, StaticDataQuestInfo>
    rawQuestInfo: StaticDataQuestInfoArray[]

    realms: Record<number, StaticDataRealm>
    rawRealms: StaticDataRealmArray[]

    reputations: Record<number, StaticDataReputation>
    rawReputations: StaticDataReputationArray[]

    reputationSets: StaticDataReputationCategory[]
    rawReputationSets: StaticDataReputationCategoryArray[]

    reputationTiers: Record<number, StaticDataReputationTier>

    toys: Record<number, StaticDataToy>
    toysById: Record<number, StaticDataToy>
    rawToys: StaticDataToyArray[]

    transmogSets: Record<number, StaticDataTransmogSet>
    rawTransmogSets: StaticDataTransmogSetArray[]

    worldQuests: Record<number, StaticDataWorldQuest>
    rawWorldQuests: StaticDataWorldQuestArray[]
}
