import { get } from 'svelte/store'

import {Constants} from '@/data/constants'
import {data as settingsData} from '@/stores/settings'
import { userStore } from '@/stores'
import type { Character} from '@/types'
import {Faction} from '@/types/enums'
import toDigits from '@/utils/to-digits'

export default function getCharacterSortFunc(): (char: Character) => string {
    const sortBy = get(settingsData).general.sortBy ?? ['level', 'name']

    return (char: Character) => {
        const out: string[] = []

        for (const thing of sortBy) {
            if (thing === 'account') {
                out.push(get(userStore).data.accounts?.[char.accountId]?.name ?? `account${char.accountId}`)
            }
            else if (thing === 'enabled') {
                const enabled = get(userStore).data.accounts?.[char.accountId]?.enabled ?? true
                out.push(enabled ? 'a' : 'z')
            }
            else if (thing === 'faction' || thing === '-faction') {
                out.push(Faction[char.faction])
            }
            else if (thing === 'itemLevel') {
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
