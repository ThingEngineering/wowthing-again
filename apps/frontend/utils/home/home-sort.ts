import type { DateTime } from 'luxon'

import { Constants } from '@/data/constants'
import { dungeonMap } from '@/data/dungeon'
import { leftPad } from '@/utils/formatting'
import { getNextWeeklyReset } from '@/utils/get-next-reset'
import { getVaultItemLevel } from '@/utils/mythic-plus'
import type { Settings } from '@/shared/stores/settings/types'
import type { LazyStore } from '@/stores'
import type { Character } from '@/types'

import { getCharacterRested } from '../get-character-rested'
import { getDungeonLevel } from '../mythic-plus/get-dungeon-level'


export function homeSort(
    lazyStore: LazyStore,
    settings: Settings,
    currentTime: DateTime,
    sortBy: string,
    char: Character
): string {
    if (sortBy === 'gold') {
        return leftPad(10_000_000 - char.gold, 8, '0')
    }
    else if (sortBy === 'itemLevel') {
        return leftPad(
            10000 - Math.floor(parseFloat(char.calculatedItemLevel || '0.0') * 10),
            5,
            '0'
        )
    }
    else if (sortBy === 'locationCurrent') {
        // adding two spaces makes it sort before " > blah"
        return char.currentLocation + '  ' || 'ZZZZZ'
    }
    else if (sortBy === 'locationHearth') {
        // adding two spaces makes it sort before " > blah"
        return char.hearthLocation + '  ' || 'ZZZZZ'
    }
    else if (sortBy === 'mythicPlusKeystone') {
        if (char.level === Constants.characterMaxLevel && char.weekly?.keystoneScannedAt) {
            const resetTime = getNextWeeklyReset(char.weekly.keystoneScannedAt, char.realm.region)
            if (resetTime > currentTime) {
                return leftPad(
                    100 - (char.weekly?.keystoneLevel || 0),
                    3,
                    '0'
                ) + (dungeonMap[char.weekly?.keystoneDungeon]?.abbreviation || 'ZZ')
            }
        }

        return '100|ZZ'
    }
    else if (sortBy === 'mythicPlusScore') {
        const rating = char.mythicPlusSeasonScores?.[Constants.mythicPlusSeason] ||
            char.raiderIo?.[Constants.mythicPlusSeason]?.all ||
            0
        return leftPad(Math.floor(100000 - (rating * 10)), 6, '0')
    }
    else if (sortBy === 'professionCooldowns') {
        const cooldownData = lazyStore.characters[char.id].professionCooldowns
        return leftPad(
            100 - (cooldownData.total > 0 ? (cooldownData.have / cooldownData.total * 100) : -1),
            3,
            '0'
        )
    }
    else if (sortBy === 'professionWorkOrders') {
        const orderData = lazyStore.characters[char.id].professionWorkOrders
        return leftPad(
            10 - (orderData.total > 0 ? orderData.have : -1),
            3,
            '0'
        )
    }
    else if (sortBy === 'restedExperience') {
        if (char.level === Constants.characterMaxLevel) {
            return '999'
        }
        else {
            const [rested,] = getCharacterRested(currentTime, char)
            return leftPad(999 - parseInt(rested), 3, '0')
        }
    }
    else if (sortBy === 'vaultMythicPlus') {
        const progress = char.isMaxLevel ? char.weekly?.vault?.mythicPlusProgress : []
        return [
            leftPad(900 - getVaultItemLevel(getDungeonLevel(progress?.[0]))[0], 3, '0'),
            leftPad(900 - getVaultItemLevel(getDungeonLevel(progress?.[1]))[0], 3, '0'),
            leftPad(900 - getVaultItemLevel(getDungeonLevel(progress?.[2]))[0], 3, '0'),
        ].join('|')
    }
    else if (sortBy.startsWith('lockout:')) {
        const lockoutKey = sortBy.split(':')[1]
        const lockout = char.lockouts?.[lockoutKey]
        if (lockout?.locked === true) {
            return [
                leftPad(100 - lockout.defeatedBosses, 3, '0'),
                leftPad(100 - lockout.maxBosses, 3, '0')
            ].join('|')
        }
        else {
            return '999|999'
        }
    }
    else if (sortBy.startsWith('task:')) {
        let value = -5

        const taskName = sortBy.split(':')[1]

        const charChore = lazyStore.characters[char.id].chores[taskName]
        if (charChore) {
            value = Math.floor(charChore.countCompleted / charChore.countTotal * 100)
        }
        else {
            const charTask = lazyStore.characters[char.id].tasks[`${settings.activeView}|${taskName}`]
            if (charTask) {
                if (charTask.text === 'Done') {
                    value = 101
                }
                else if (charTask.text === 'Get!') {
                    value = -1
                }
                else {
                    const percentMatch = charTask.text.match(/^(\d+) %$/)
                    if (percentMatch) {
                        value = parseInt(percentMatch[1])
                    }
                    else {
                        const countMatch = charTask.text.match(/^(\d+) \/ (\d+)$/)
                        if (countMatch) {
                            value = Math.floor(parseInt(countMatch[1]) / parseInt(countMatch[2]) * 100)
                        }
                    }
                }
            }
        }

        return leftPad(100 - value, 3, '0')
    }
}
