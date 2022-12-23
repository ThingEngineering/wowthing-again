import type { DateTime } from 'luxon'

import parseApiTime from './parse-api-time'
import { Constants } from '@/data/constants'
import { experiencePerLevel } from '@/data/experience'
import type { Character } from '@/types'


export function getCharacterRested(now: DateTime, character: Character): string {
    let rested = ''

    if (character.level < Constants.characterMaxLevel) {
        if (character.lastSeenAddon.startsWith('0001-')) {
            rested = '???'
        }
        else {
            let per = Math.min(150, Math.round(character.restedExperience / experiencePerLevel[character.level] * 100))
            if (per < 150) {
                const lastSeen = parseApiTime(character.lastSeenAddon)
                let restedPer = (now.diff(lastSeen).toMillis() / 1000) / Constants.restedDuration * 150
                // Outside a resting area is 4x slower
                if (!character.isResting) {
                    restedPer /= 4
                }
                // Pandaren earn rested twice as fast
                if (character.raceId === 24 || character.raceId === 25 || character.raceId === 26) {
                    restedPer *= 2
                }
                per = Math.floor(Math.min(150, per + restedPer))
            }
            rested = `${per} %`
        }
    }

    return rested
}