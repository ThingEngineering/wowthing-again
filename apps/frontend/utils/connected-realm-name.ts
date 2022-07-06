import { get } from 'svelte/store'

import { staticStore, userStore } from '@/stores'


export default function connectedRealmName(realmId: number): string {
    const staticData = get(staticStore).data
    const userData = get(userStore).data

    const realmNames: Record<string, boolean> = {}
    for (const character of userData.characters) {
        realmNames[character.realm.name] = true
    }

    const connectedRealm = staticData.connectedRealms[realmId]
    const useMe: string[] = []
    let extra = 0
    for (const realmName of connectedRealm.realmNames) {
        if (realmNames[realmName]) {
            useMe.push(realmName)
        }
        else {
            extra++
        }
    }

    let ret = useMe.join(' / ')
    if (extra > 0) {
        ret += ` (+${extra})`
    }
    return ret
}
