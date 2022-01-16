import { get } from 'svelte/store'

import {Constants} from '@/data/constants'
import { userStore } from '@/stores'
import type { Character, Settings, UserData } from '@/types'
import toDigits from '@/utils/to-digits'
import { Region } from '@/types/enums'

export default function getCharacterSortFunc(
    settingsData: Settings,
    prefixFunc?: (char: Character) => string
): (char: Character) => string
{
    const sortBy = settingsData.general.sortBy ?? ['level', 'name']

    return (char: Character) => {
        const out: string[] = []
        const userData: UserData = get(userStore).data

        if (prefixFunc) {
            out.push(prefixFunc(char))
        }

        const index = settingsData.characters.pinnedCharacters?.indexOf(char.id) ?? -1
        out.push(toDigits(index >= 0 ? index : 999, 3))

        for (const thing of sortBy) {
            if (thing === 'account') {
                out.push(userData.accounts?.[char.accountId]?.name ?? `account${char.accountId}`)
            }
            else if (thing === 'enabled') {
                const enabled = userData.accounts?.[char.accountId]?.enabled ?? true
                out.push(enabled ? 'a' : 'z')
            }
            else if (thing === 'faction') {
                out.push(char.faction.toString())
            }
            else if (thing === '-faction') {
                out.push((5 - char.faction).toString())
            }
            else if (thing === 'gold') {
                out.push(toDigits(10_000_000 - char.gold, 8).toString())
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
            else if (thing === 'realm') {
                out.push(Region[char.realm.region])
                out.push(char.realm.name)
            }
        }

        return out.join('|')
    }
}
