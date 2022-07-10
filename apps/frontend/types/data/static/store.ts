import type { StaticDataBag, StaticDataBagArray } from './bag'
import type { StaticDataCharacterClass, StaticDataCharacterRace, StaticDataCharacterSpecialization } from './character'
import type { StaticDataCurrency, StaticDataCurrencyArray, StaticDataCurrencyCategory, StaticDataCurrencyCategoryArray } from './currency'
import type { StaticDataInstance, StaticDataInstanceArray } from './instance'
import type { StaticDataItem, StaticDataItemArray } from './item'
import type { StaticDataMount, StaticDataMountArray } from './mount'
import type { StaticDataPet, StaticDataPetArray } from './pet'
import type { StaticDataProfession } from './profession'
import type { StaticDataProgressCategory } from './progress'
import type { StaticDataRaiderIoScoreTiers } from './raider-io'
import type { StaticDataConnectedRealm, StaticDataRealm, StaticDataRealmArray } from './realm'
import type { StaticDataReputation, StaticDataReputationArray, StaticDataReputationCategory, StaticDataReputationTier } from './reputation'
import type { StaticDataSetCategory, StaticDataSetCategoryArray } from './set'
import type { StaticDataSoulbind } from './soulbind'
import type { StaticDataToy, StaticDataToyArray } from './toy'
import type { StaticDataVendorCategory } from './vendor'

import type { UserCount } from '@/types'
import type { ZoneMapDataCategory } from '@/types/data'


export interface StaticData {
    connectedRealms: Record<number, StaticDataConnectedRealm>
    professions: Record<number, StaticDataProfession>
    progress: StaticDataProgressCategory[][]
    raiderIoScoreTiers: Record<number, StaticDataRaiderIoScoreTiers>
    soulbinds: Record<number, StaticDataSoulbind[]>
    talents: Record<number, number[][]>

    characterClasses: Record<number, StaticDataCharacterClass>
    characterClassesBySlug: Record<string, StaticDataCharacterClass>
    characterRaces: Record<number, StaticDataCharacterRace>
    characterSpecializations: Record<number, StaticDataCharacterSpecialization>

    bags: Record<number, StaticDataBag>
    rawBags: StaticDataBagArray[]

    currencies: Record<number, StaticDataCurrency>
    rawCurrencies: StaticDataCurrencyArray[]

    currencyCategories: Record<number, StaticDataCurrencyCategory>
    rawCurrencyCategories: StaticDataCurrencyCategoryArray[]

    instances: Record<number, StaticDataInstance>
    instancesRaw: StaticDataInstanceArray[]

    items: Record<number, StaticDataItem>
    rawItems: StaticDataItemArray[]

    mounts: Record<number, StaticDataMount>
    rawMounts: StaticDataMountArray[]

    mountSets: StaticDataSetCategory[][]
    mountSetsRaw: StaticDataSetCategoryArray[][]

    pets: Record<number, StaticDataPet>
    rawPets: StaticDataPetArray[]

    petSets: StaticDataSetCategory[][]
    petSetsRaw: StaticDataSetCategoryArray[][]

    realms: Record<number, StaticDataRealm>
    realmsRaw: StaticDataRealmArray[]

    reputations: Record<number, StaticDataReputation>
    rawReputations: StaticDataReputationArray[]

    reputationSets: StaticDataReputationCategory[]
    reputationTiers: Record<number, StaticDataReputationTier>

    toys: Record<number, StaticDataToy>
    rawToys: StaticDataToyArray[]

    toySets: StaticDataSetCategory[][]
    toySetsRaw: StaticDataSetCategoryArray[][]

    vendorSets: StaticDataVendorCategory[][]
    vendorStats: Record<string, UserCount>

    zoneMapSets: ZoneMapDataCategory[][]
}
