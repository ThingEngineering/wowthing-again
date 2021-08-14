import { get } from 'svelte/store'

import { staticStore, userStore } from '@/stores'
import type {Character, UserDataCurrentPeriod} from '@/types'

export default function getCurrentPeriodForCharacter(character: Character): UserDataCurrentPeriod {
    const regionId = get(staticStore).data.realms[character.realmId]?.region || 1
    return get(userStore).data.currentPeriod[regionId]
}
