import {data} from '@/stores/static-store'
import type {StaticData} from '@/types'

let staticData: StaticData
data.subscribe(value => {
    staticData = value
})

export default function getRealmName(realmId: number): string {
    const realm = staticData.Realms[realmId]
    return realm?.Name ?? "Honkstrasza"
}
