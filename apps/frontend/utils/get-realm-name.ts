import { get } from 'svelte/store'

import { staticStore } from '@/stores/static/static'


export default function getRealmName(realmId: number): string {
    const realm = get(staticStore).realms[realmId]
    return realm?.name ?? 'Honkstrasza'
}
