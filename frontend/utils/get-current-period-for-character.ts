import { get } from 'svelte/store'

import { userStore } from '@/stores'
import type {Character, UserDataCurrentPeriod} from '@/types'

export default function getCurrentPeriodForCharacter(character: Character): UserDataCurrentPeriod {
    const regionId = character.realm?.region || 1
    return get(userStore).data.currentPeriod[regionId]
}
