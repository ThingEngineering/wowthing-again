import { get } from 'svelte/store'

import {Constants} from '@/data/constants'
import { userStore } from '@/stores'
import leftPad from '@/utils/left-pad'
import { Region } from '@/enums'
import type { Character, Settings, UserData } from '@/types'
import type { StaticData } from '@/types/data/static'

export default function getCharacterSortFunc(
    settingsData: Settings,
    staticData: StaticData,
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
        out.push(leftPad(index >= 0 ? index : 999, 3, '0'))

        for (const thing of sortBy) {
            if (thing === 'account') {
                out.push(userData.accounts?.[char.accountId]?.tag ?? `account${char.accountId}`)
            }
            else if (thing === 'armor') {
                switch (char.classId) {
                    // Priest, Mage, Warlock
                    case 5:
                    case 8:
                    case 9:
                        out.push('C')
                        break
                    
                    // Rogue, Monk, Druid, Demon Hunter
                    case 4:
                    case 10:
                    case 11:
                    case 12:
                        out.push('L')
                        break
                    
                    // Hunter, Shaman, Evoker
                    case 3:
                    case 7:
                    case 13:
                        out.push('M')
                        break
                    
                    //
                    default:
                        out.push('P')
                        break
                }
            }
            else if (thing === 'class') {
                out.push(staticData.characterClasses[char.classId].name)
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
                out.push(leftPad(10_000_000 - char.gold, 8, '0'))
            }
            else if (thing === 'itemlevel' || thing == 'itemLevel') { // TODO remove me once users are fixed
                out.push(leftPad(1000 - parseInt(char.calculatedItemLevel || '0'), 4, '0'))
            }
            else if (thing === 'level') {
                // in descending order
                const level = leftPad(Constants.characterMaxLevel - char.level, 2, '0')
                if (settingsData.layout.showPartialLevel) {
                    out.push(`${level}.${leftPad(char.addonLevelXp || 0, 7, '0')}`)
                }
                else {
                    out.push(level)
                }
            }
            else if (thing === 'mplusrating') {
                const rating = char.raiderIo?.[Constants.mythicPlusSeason]?.all || 0
                out.push(leftPad(Math.floor(10000 - rating), 5, '0'))
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
