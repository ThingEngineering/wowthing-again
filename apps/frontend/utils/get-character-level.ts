import { Constants } from '@/data/constants'
import { experiencePerLevel } from '@/data/experience'
import type { Character } from '@/types'

interface CharacterLevel {
    level: number
    partial: number
    xp: number
}

export function getCharacterLevel(character: Character): CharacterLevel {
    const ret: CharacterLevel = {
        level: 0,
        partial: 0,
        xp: 0,
    }

    const addonLevel = character.addonLevel || 0
    ret.level = Math.max(character.level, addonLevel)

    if (ret.level < Constants.characterMaxLevel && addonLevel >= character.level) {
        ret.xp = character.addonLevelXp || 0
        ret.partial = Math.floor(ret.xp / experiencePerLevel[ret.level] * 10)
    }

    return ret
}
