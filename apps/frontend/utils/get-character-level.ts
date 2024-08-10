import { Constants } from '@/data/constants';
import { experiencePerLevel } from '@/data/experience';
import type { Character } from '@/types';

interface CharacterLevel {
    level: number;
    partial: number;
    xp: number;
}

export function getCharacterLevel(character: Character): CharacterLevel {
    const ret: CharacterLevel = {
        level: character.level,
        partial: 0,
        xp: 0,
    };

    if (ret.level < Constants.characterMaxLevel) {
        ret.xp = character.levelXp || 0;
        ret.partial = Math.max(
            0,
            Math.min(9, Math.floor((ret.xp / experiencePerLevel[ret.level]) * 10)),
        );
    }

    return ret;
}
