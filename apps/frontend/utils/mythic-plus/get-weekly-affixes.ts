import { get } from 'svelte/store'

import { weeklyAffixes } from '@/data/dungeon'
import { userStore } from '@/stores'
import type { Character, MythicPlusAffix } from '@/types'


export function getWeeklyAffixes(character: Character): MythicPlusAffix[] {
    const userData = get(userStore)
    return weeklyAffixes[(userData.currentPeriod[character.realm.region].id - 809) % weeklyAffixes.length]
}
