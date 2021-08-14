import { get } from 'svelte/store'

import { staticStore } from '@/stores/static'


export default function getRealmName(realmId: number): string {
    const realm = get(staticStore).data.realms[realmId]
    return realm?.name ?? 'Honkstrasza'
}
