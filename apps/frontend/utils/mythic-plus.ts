import { get } from 'svelte/store'

import type { Character, CharacterMythicPlusAddonMapAffix, MythicPlusAffix } from '@/types'
import { weeklyAffixes } from '@/data/dungeon'
import { userStore } from '@/stores'


export function getWeeklyAffixes(character: Character): MythicPlusAffix[] {
    const userData = get(userStore)
    return weeklyAffixes[(userData.currentPeriod[character.realm.region].id - 809) % weeklyAffixes.length]
}

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

export function getBaseScoreForKeyLevel(keyLevel: number): number {
    // 25 for completion
    // 10 for seasonal affix
    //  5 per normal affix
    //  5 per keystone level

    let affixes = 0
    if (keyLevel <= 3) {
        affixes = 1
    }
    else if (keyLevel <= 6) {
        affixes = 2
    }
    else if (keyLevel <= 9) {
        affixes = 3
    }
    else {
        affixes = 5
    }
    return 25 + (affixes * 5) + (keyLevel * 5)
}
