import { get } from 'svelte/store'

import {Faction} from '@/data/faction'
import { data as userData } from '@/stores/user'
import type { Character} from '@/types'

export default function getCharacterGroupFunc(): (char: Character) => string {
    // TODO hook this up to settings
    const groupBy = ['faction']

    return (char: Character) => {
        const out: string[] = []

        for (const thing of groupBy) {
            if (thing === 'account') {
                out.push(get(userData).accounts?.[char.accountId]?.name ?? 'account')
            }
            else if (thing === 'enabled') {
                const enabled = get(userData).accounts?.[char.accountId]?.enabled ?? true
                out.push(enabled ? 'a' : 'z')
            }
            else if (thing === 'faction') {
                out.push(Faction[char.faction])
            }
        }

        return out.join('|')
    }
}
