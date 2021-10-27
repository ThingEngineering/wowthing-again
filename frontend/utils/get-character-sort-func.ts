import { get } from 'svelte/store'

import {Constants} from '@/data/constants'
import { userStore } from '@/stores'
import type { Character, Settings } from '@/types'
import toDigits from '@/utils/to-digits'

export default function getCharacterSortFunc(settingsData: Settings, prefixFunc?: (char: Character) => string): (char: Character) => string {
    const sortBy = settingsData.general.sortBy ?? ['level', 'name']

    return (char: Character) => {
        const out: string[] = []

        if (prefixFunc) {
            out.push(prefixFunc(char))
        }

        for (const thing of sortBy) {
            if (thing === 'account') {
                out.push(get(userStore).data.accounts?.[char.accountId]?.name ?? `account${char.accountId}`)
            }
            else if (thing === 'enabled') {
                const enabled = get(userStore).data.accounts?.[char.accountId]?.enabled ?? true
                out.push(enabled ? 'a' : 'z')
            }
            else if (thing === 'faction') {
                out.push(char.faction.toString())
            }
            else if (thing === '-faction') {
                out.push((5 - char.faction).toString())
            }
            else if (thing === 'gold') {
                out.push((1000000000 - char.gold).toString())
            }
            else if (thing === 'itemlevel' || thing == 'itemLevel') { // TODO remove me once users are fixed
                out.push(toDigits(1000 - parseInt(char.calculatedItemLevel || '0'), 4))
            }
            else if (thing === 'level') {
                // this will sort by level in descending order
                out.push(toDigits(Constants.characterMaxLevel - char.level, 2))
            }
            else if (thing === 'name') {
                out.push(char.name)
            }
        }

        return out.join('|')
    }
}
