import { get } from 'svelte/store'

import {Constants} from '@/data/constants'
import { data as settingsData } from '@/stores/settings'
import { userStore } from '@/stores'
import type { Character} from '@/types'
import {Faction} from '@/types/enums'

export default function getCharacterGroupFunc(): (char: Character) => string {
    const groupBy = get(settingsData).general.groupBy
    const minusFaction = get(settingsData).general.sortBy.indexOf('-faction') >= 0

    return (char: Character) => {
        const out: string[] = []

        for (const thing of groupBy) {
            if (thing === 'account') {
                out.push(get(userStore).data.accounts?.[char.accountId]?.name ?? `account${char.accountId}`)
            }
            else if (thing === 'enabled') {
                const enabled = get(userStore).data.accounts?.[char.accountId]?.enabled ?? true
                out.push(enabled ? 'a' : 'z')
            }
            else if (thing === 'faction') {
                if (minusFaction) {
                    out.push((5 - char.faction).toString())
                }
                else {
                    out.push(char.faction.toString())
                }
            }
            else if (thing === 'maxLevel') {
                out.push(char.level === Constants.characterMaxLevel ? 'a' : 'z')
            }
        }

        return out.join('|')
    }
}
