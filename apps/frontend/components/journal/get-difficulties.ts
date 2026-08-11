import {
    difficultyHeroic,
    difficultyLookingForRaid,
    difficultyMap,
    difficultyMythic,
    difficultyNormal,
    difficultyTimewalking,
    difficultyWorld,
} from '@/data/difficulty';
import { Difficulty } from '@/enums/difficulty';
import type { JournalDataEncounterItemAppearance, JournalDataInstance } from '@/types/data/journal';

const raidSizeInstances: Set<number> = new Set([
    753, // Vault of Archavon
    754, // Naxxramas
    755, // The Obsidian Sanctum
    756, // The Eye of Eternity
    757, // Trial of the Crusader
    758, // Icecrown Citadel
    // 759, // Ulduar
    760, // Onyxia's Lair
    761, // The Ruby Sanctum
]);

export function getDifficulties(
    instance: JournalDataInstance,
    appearance: JournalDataEncounterItemAppearance
): [string[], string[]] {
    if (!appearance.difficulties) {
        return [[], []];
    }

    const ret: [string[], string[]] = [[], []];
    if (raidSizeInstances.has(instance.id)) {
        const normal10 = appearance.difficulties.includes(Difficulty.RaidLegacy10Normal);
        const normal25 = appearance.difficulties.includes(Difficulty.RaidLegacy10Heroic);
        const heroic10 = appearance.difficulties.includes(Difficulty.RaidLegacy25Normal);
        const heroic25 = appearance.difficulties.includes(Difficulty.RaidLegacy25Heroic);

        if (normal10 && normal25 && heroic10 && heroic25) {
            ret[0].push('N', 'H');
            ret[1].push('10/25 Normal', '10/25 Heroic');
        } else if (normal10 && normal25) {
            ret[0].push('N');
            ret[1].push('10/25 Normal');
        } else if (heroic10 && heroic25) {
            ret[0].push('H');
            ret[1].push('10/25 Heroic');
        } else if (normal10 && heroic10) {
            ret[0].push('10NH');
            ret[1].push('10 Normal/Heroic');
        } else if (normal25 && heroic25) {
            ret[0].push('25NH');
            ret[1].push('25 Normal/Heroic');
        } else if (normal10) {
            ret[0].push('10N');
            ret[1].push('10 Normal');
        } else if (normal25) {
            ret[0].push('25N');
            ret[1].push('25 Normal');
        } else if (heroic10) {
            ret[0].push('10H');
            ret[1].push('10 Heroic');
        } else if (heroic25) {
            ret[0].push('25H');
            ret[1].push('25 Heroic');
        }
    } else {
        if (difficultyWorld.some((id) => appearance.difficulties.includes(id))) {
            ret[0].push(difficultyMap[Difficulty.RaidWorld].shortName);
            ret[1].push(difficultyMap[Difficulty.RaidWorld].name);
        }
        if (difficultyLookingForRaid.some((id) => appearance.difficulties.includes(id))) {
            ret[0].push(difficultyMap[Difficulty.RaidLookingForRaid].shortName);
            ret[1].push(difficultyMap[Difficulty.RaidLookingForRaid].name);
        }
        if (difficultyNormal.some((id) => appearance.difficulties.includes(id))) {
            ret[0].push(difficultyMap[Difficulty.RaidNormal].shortName);
            ret[1].push(difficultyMap[Difficulty.RaidNormal].name);
        }
        if (difficultyHeroic.some((id) => appearance.difficulties.includes(id))) {
            ret[0].push(difficultyMap[Difficulty.RaidHeroic].shortName);
            ret[1].push(difficultyMap[Difficulty.RaidHeroic].name);
        }
        if (difficultyMythic.some((id) => appearance.difficulties.includes(id))) {
            ret[0].push(difficultyMap[Difficulty.RaidMythic].shortName);
            ret[1].push(difficultyMap[Difficulty.RaidMythic].name);
        }
        if (difficultyTimewalking.some((id) => appearance.difficulties.includes(id))) {
            ret[0].push(difficultyMap[Difficulty.RaidTimewalking].shortName);
            ret[1].push(difficultyMap[Difficulty.RaidTimewalking].name);
        }
    }
    return ret;
}
