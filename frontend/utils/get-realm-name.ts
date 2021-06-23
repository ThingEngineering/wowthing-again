import { data } from '@/stores/static'
import type { StaticData } from '@/types'

let staticData: StaticData
data.subscribe((value) => {
    staticData = value
})

export default function getRealmName(realmId: number): string {
    const realm = staticData.realms[realmId]
    return realm?.name ?? 'Honkstrasza'
}
