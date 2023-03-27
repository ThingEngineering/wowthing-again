import { Constants } from '@/data/constants'
import { dungeonMap } from '@/data/dungeon'
import { leftPad } from '@/utils/formatting'
import { getVaultItemLevel } from '@/utils/mythic-plus'
import type { Character } from '@/types'
import type { LazyStore } from '@/stores'


export function homeSort(
    lazyStore: LazyStore,
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
    else if (sortBy === 'mythicPlusKeystone') {
        return leftPad(
            100 - (char.weekly?.keystoneLevel || 0),
            3,
            '0'
        ) + (dungeonMap[char.weekly?.keystoneDungeon]?.abbreviation || 'ZZ')
    }
    else if (sortBy === 'mythicPlusScore') {
        return leftPad(
            10000 - Math.floor(char.mythicPlusSeasonScores?.[Constants.mythicPlusSeason] || 0),
            5,
            '0'
        )
    }
    else if (sortBy === 'vaultMythicPlus') {
        const progress = char.isMaxLevel ? char.weekly?.vault?.mythicPlusProgress : []
        return [
            leftPad(999 - getVaultItemLevel(progress?.[0]?.level || 0), 3, '0'),
            leftPad(999 - getVaultItemLevel(progress?.[1]?.level || 0), 3, '0'),
            leftPad(999 - getVaultItemLevel(progress?.[2]?.level || 0), 3, '0'),
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
        let value = 0

        const taskName = sortBy.split(':')[1]

        const charChore = lazyStore.characters[char.id].chores[taskName]
        if (charChore) {
            value = Math.floor(charChore.countCompleted / charChore.countTotal * 100)
        }
        else {
            const charTask = lazyStore.characters[char.id].tasks[taskName]
            if (charTask) {
                if (charTask.text === 'Done') {
                    value = 100
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
