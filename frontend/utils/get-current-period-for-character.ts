import { get } from 'svelte/store'

import {data as staticData} from '@/stores/static'
import { userStore } from '@/stores'
import type {Character, UserDataCurrentPeriod} from '@/types'

export default function getCurrentPeriodForCharacter(character: Character): UserDataCurrentPeriod {
    const regionId = get(staticData).realms[character.realmId]?.region || 1
    return get(userStore).data.currentPeriod[regionId]
}
