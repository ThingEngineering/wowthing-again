import { get } from 'svelte/store'

import { userStore } from '@/stores'
import { staticStore } from '@/stores/static'


export default function connectedRealmName(realmId: number): string {
    const staticData = get(staticStore)
    const userData = get(userStore)

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

    if (useMe.length === 0) {
        useMe.push(connectedRealm.realmNames[0])
        extra = connectedRealm.realmNames.length - 1
    }

    let ret = useMe.join(' / ')
    if (extra > 0) {
        ret += ` (+${extra})`
    }
    return ret
}
