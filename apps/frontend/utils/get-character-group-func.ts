import { get } from 'svelte/store'

import { Constants } from '@/data/constants'
import { userStore } from '@/stores'
import { staticStore } from '@/shared/stores/static'
import type { Character } from '@/types'
import type { Settings } from '@/shared/stores/settings/types'

export default function getCharacterGroupFunc(
    settingsData: Settings,
    viewGroupBy?: string[],
    viewSortBy?: string[]
): (char: Character) => string {
    const groupBy = viewGroupBy || settingsData.views[0].groupBy || []
    const sortBy = viewSortBy || settingsData.views[0].sortBy || []
    const minusFaction = sortBy.indexOf('-faction') >= 0

    return (char: Character) => {
        const out: string[] = []

        for (const thing of groupBy) {
            if (thing === 'account') {
                out.push(get(userStore).accounts?.[char.accountId]?.tag ?? `account${char.accountId}`)
            }
            else if (thing === 'enabled') {
                const enabled = get(userStore).accounts?.[char.accountId]?.enabled ?? true
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
            else if (thing === 'maxlevel') {
                out.push(char.level === Constants.characterMaxLevel ? 'a' : 'z')
            }
            else if (thing === 'pinned') {
                out.push(settingsData.characters.pinnedCharacters.indexOf(char.id) >= 0 ? 'a' : 'z')
            }
            else if (thing === 'realm') {
                out.push(get(staticStore).connectedRealms[char.realm.connectedRealmId]?.displayText || '???')
            }
        }

        return out.join('|')
    }
}
