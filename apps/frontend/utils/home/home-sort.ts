import { Constants } from '@/data/constants'
import { dungeonMap } from '@/data/dungeon'
import { leftPad } from '@/utils/formatting'
import { getVaultItemLevel } from '@/utils/mythic-plus'
import type { Character } from '@/types'


export function homeSort(sortBy: string, char: Character): string {
    if (sortBy === 'itemLevel') {
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
}
