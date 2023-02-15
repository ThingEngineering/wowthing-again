import { getBaseScoreForKeyLevel } from './get-base-score-for-key-level'
import { getWeeklyAffixes } from './get-weekly-affixes'
import type { Character, CharacterMythicPlusAddonMapAffix } from '@/types'


interface IsKeystoneUpgradeResult {
    isUpgrade: boolean
    mapInfo: CharacterMythicPlusAddonMapAffix
    scoreIncrease: number
}

export function isKeystoneUpgrade(character: Character, season: number, dungeonId: number): IsKeystoneUpgradeResult {
    const addonMap = character.mythicPlusSeasons?.[season]?.[dungeonId]
    const affixes = getWeeklyAffixes(character)

    let isUpgrade = false
    let mapInfo: CharacterMythicPlusAddonMapAffix
    let scoreIncrease = 0
    if (addonMap && affixes) {
        let altMapInfo: CharacterMythicPlusAddonMapAffix
        if (affixes[0].name === 'Fortified') {
            mapInfo = addonMap.fortifiedScore
            altMapInfo = addonMap.tyrannicalScore
        }
        else {
            mapInfo = addonMap.tyrannicalScore
            altMapInfo = addonMap.fortifiedScore
        }

        isUpgrade = (
            (!mapInfo) ||
            (character.weekly.keystoneLevel > mapInfo.level) ||
            (character.weekly.keystoneLevel === mapInfo.level && mapInfo.overTime)
        )

        const scoreValues = [mapInfo?.score ?? 0, altMapInfo?.score ?? 0]
        const score = Math.max(...scoreValues) + (scoreValues.reduce((a, b) => a + b, 0) / 2)

        const expectedValues = [getBaseScoreForKeyLevel(character.weekly.keystoneLevel), scoreValues[1]]
        const expectedScore = Math.max(...expectedValues) + (expectedValues.reduce((a, b) => a + b, 0) / 2)

        scoreIncrease = expectedScore - score
    }

    return {
        isUpgrade,
        mapInfo,
        scoreIncrease,
    }
}
