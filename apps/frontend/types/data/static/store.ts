import type { StaticDataCurrency, StaticDataCurrencyArray, StaticDataCurrencyCategory } from './currency'
import type { StaticDataInstance, StaticDataInstanceArray } from './instance'
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
    bags: Record<number, [number, number]>
    connectedRealms: Record<number, StaticDataConnectedRealm>
    currencyCategories: Record<number, StaticDataCurrencyCategory>
    professions: Record<number, StaticDataProfession>
    progress: StaticDataProgressCategory[][]
    raiderIoScoreTiers: Record<number, StaticDataRaiderIoScoreTiers>
    soulbinds: Record<number, StaticDataSoulbind[]>
    talents: Record<number, number[][]>

    zoneMapSets: ZoneMapDataCategory[][]

    currencies: Record<number, StaticDataCurrency>
    currenciesRaw: StaticDataCurrencyArray[]

    instances: Record<number, StaticDataInstance>
    instancesRaw: StaticDataInstanceArray[]

    mounts: Record<number, StaticDataMount>
    mountsBySpellId: Record<number, StaticDataMount>
    mountsRaw: StaticDataMountArray[]

    mountSets: StaticDataSetCategory[][]
    mountSetsRaw: StaticDataSetCategoryArray[][]

    pets: Record<number, StaticDataPet>
    petsByCreatureId: Record<number, StaticDataPet>
    petsRaw: StaticDataPetArray[]

    petSets: StaticDataSetCategory[][]
    petSetsRaw: StaticDataSetCategoryArray[][]

    realms: Record<number, StaticDataRealm>
    realmsRaw: StaticDataRealmArray[]

    reputations: Record<number, StaticDataReputation>
    reputationsRaw: StaticDataReputationArray[]

    reputationSets: StaticDataReputationCategory[]
    reputationTiers: Record<number, StaticDataReputationTier>

    toys: Record<number, StaticDataToy>
    toysRaw: StaticDataToyArray[]

    toySets: StaticDataSetCategory[][]
    toySetsRaw: StaticDataSetCategoryArray[][]

    vendorSets: StaticDataVendorCategory[][]
    vendorStats: Record<string, UserCount>
}
