import type { StaticDataRealm } from '@/types/data/static'


export interface Guild {
    id: number
    name: string
    realmId: number

    realm: StaticDataRealm
}
