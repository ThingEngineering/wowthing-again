import { Constants } from '@/data/constants'
import { dungeonMap } from '@/data/dungeon'
import { leftPad } from '@/utils/formatting'
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
}
