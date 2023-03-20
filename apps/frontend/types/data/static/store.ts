import type { StaticDataBag, StaticDataBagArray } from './bag'
import type { StaticDataCharacterClass, StaticDataCharacterRace, StaticDataCharacterSpecialization } from './character'
import type { StaticDataCurrency, StaticDataCurrencyArray, StaticDataCurrencyCategory, StaticDataCurrencyCategoryArray } from './currency'
import type { StaticDataHoliday, StaticDataHolidayArray } from './holiday'
import type { StaticDataIllusion } from './illusion'
import type { StaticDataInstance, StaticDataInstanceArray } from './instance'
import type { StaticDataKeystoneAffix } from './keystone-affix'
import type { StaticDataMount, StaticDataMountArray } from './mount'
import type { StaticDataPet, StaticDataPetArray } from './pet'
import type { StaticDataProfession } from './profession'
import type { StaticDataRaiderIoScoreTiers } from './raider-io'
import type { StaticDataConnectedRealm, StaticDataRealm, StaticDataRealmArray } from './realm'
import type { StaticDataReputation, StaticDataReputationArray, StaticDataReputationCategory, StaticDataReputationCategoryArray, StaticDataReputationTier } from './reputation'
import type { StaticDataSoulbind } from './soulbind'
import type { StaticDataToy, StaticDataToyArray } from './toy'


export interface StaticData {
    connectedRealms: Record<number, StaticDataConnectedRealm>
    illusions: Record<number, StaticDataIllusion>
    keystoneAffixes: Record<number, StaticDataKeystoneAffix>
    professions: Record<number, StaticDataProfession>
    questNames: Record<number, string>
    raiderIoScoreTiers: Record<number, StaticDataRaiderIoScoreTiers>
    soulbinds: Record<number, StaticDataSoulbind[]>
    talents: Record<number, number[][]>

    characterClasses: Record<number, StaticDataCharacterClass>
    characterClassesBySlug: Record<string, StaticDataCharacterClass>
    characterRaces: Record<number, StaticDataCharacterRace>
    characterRacesBySlug: Record<string, StaticDataCharacterRace>
    characterSpecializations: Record<number, StaticDataCharacterSpecialization>

    bags: Record<number, StaticDataBag>
    rawBags: StaticDataBagArray[]

    currencies: Record<number, StaticDataCurrency>
    rawCurrencies: StaticDataCurrencyArray[]

    currencyCategories: Record<number, StaticDataCurrencyCategory>
    rawCurrencyCategories: StaticDataCurrencyCategoryArray[]

    holidays: Record<number, StaticDataHoliday>
    rawHolidays: StaticDataHolidayArray[]

    instances: Record<number, StaticDataInstance>
    instancesRaw: StaticDataInstanceArray[]

    mounts: Record<number, StaticDataMount>
    rawMounts: StaticDataMountArray[]

    pets: Record<number, StaticDataPet>
    petsByName: Record<string, StaticDataPet>
    rawPets: StaticDataPetArray[]

    realms: Record<number, StaticDataRealm>
    rawRealms: StaticDataRealmArray[]

    reputations: Record<number, StaticDataReputation>
    rawReputations: StaticDataReputationArray[]

    reputationSets: StaticDataReputationCategory[]
    rawReputationSets: StaticDataReputationCategoryArray[]

    reputationTiers: Record<number, StaticDataReputationTier>

    toys: Record<number, StaticDataToy>
    rawToys: StaticDataToyArray[]
}
