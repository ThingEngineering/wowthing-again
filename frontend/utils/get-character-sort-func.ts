import { get } from 'svelte/store'

import { data as userData } from '@/stores/user'
import type { Character} from '@/types'
import {Faction} from '@/types/enums'

export default function getCharacterSortFunc(): (char: Character) => string {
    // TODO hook this up to settings
    const groupBy = ['enabled', 'faction']

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

        console.log(out, char)
        return out.join('|')
    }
}
