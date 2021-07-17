import { get } from 'svelte/store'

import {Constants} from '@/data/constants'
import { data as settingsData } from '@/stores/settings'
import userStore from '@/stores/user'
import type { Character} from '@/types'
import {Faction} from '@/types/enums'

export default function getCharacterGroupFunc(): (char: Character) => string {
    const groupBy = get(settingsData).general.groupBy

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
                out.push(Faction[char.faction])
            }
            else if (thing === 'maxLevel') {
                out.push(char.level === Constants.characterMaxLevel ? 'a' : 'z')
            }
        }

        return out.join('|')
    }
}
