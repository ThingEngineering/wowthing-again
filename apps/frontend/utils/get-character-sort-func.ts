import { get } from 'svelte/store'

import { Constants } from '@/data/constants'
import { PlayableClass } from '@/enums/playable-class'
import { userStore } from '@/stores'
import { leftPad } from '@/utils/formatting'
import { Region } from '@/enums/region'
import type { Character, Settings, UserData } from '@/types'
import type { StaticData } from '@/shared/stores/static/types'
import { getCharacterLevel } from './get-character-level'

export default function getCharacterSortFunc(
    settingsData: Settings,
    staticData: StaticData,
    prefixFunc?: (char: Character) => string
): (char: Character) => string
{
    const sortBy = settingsData.general.sortBy || ['level', 'name']

    return (char: Character) => {
        const out: string[] = []
        const userData: UserData = get(userStore)

        if (prefixFunc) {
            out.push(prefixFunc(char))
        }

        const index = settingsData.characters.pinnedCharacters?.indexOf(char.id) ?? -1
        out.push(leftPad(index >= 0 ? index : 999, 3, '0'))

        for (const thing of sortBy) {
            if (thing === 'account') {
                out.push(userData.accounts?.[char.accountId]?.tag ?? `account${char.accountId}`)
            }
            else if (thing === 'armor' || thing === '-armor') {
                const desc = thing === '-armor'
                switch (char.classId) {
                    case PlayableClass.Mage:
                    case PlayableClass.Priest:
                    case PlayableClass.Warlock:
                        out.push(desc ? '4' : '1')
                        break
                    
                    case PlayableClass.DemonHunter:
                    case PlayableClass.Druid:
                    case PlayableClass.Monk:
                    case PlayableClass.Rogue:
                        out.push(desc ? '3' : '2')
                        break
                    
                    case PlayableClass.Hunter:
                    case PlayableClass.Shaman:
                    case PlayableClass.Evoker:
                        out.push(desc ? '2' : '3')
                        break
                    
                    case PlayableClass.Paladin:
                    case PlayableClass.DeathKnight:
                    case PlayableClass.Warrior:
                        out.push(desc ? '1' : '4')
                        break
                    
                    default:
                        out.push('9')
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
            else if (thing === 'guild') {
                if (char.guild) {
                    out.push(`${char.guild.name}--${char.realm?.name || 'ZZZ'}`)
                }
                else {
                    out.push('ZZZZZZ')
                }
            }
            else if (thing === 'itemlevel' || thing == 'itemLevel') { // TODO remove me once users are fixed
                out.push(leftPad(
                    10000 - Math.floor(parseFloat(char.calculatedItemLevel || '0.0') * 10),
                    5,
                    '0'
                ))
            }
            else if (thing === 'level') {
                // in descending order
                const levelData = getCharacterLevel(char)
                out.push([
                    leftPad(Constants.characterMaxLevel - levelData.level, 2, '0'),
                    (9 - levelData.partial).toString(),
                ].join('.'))
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
