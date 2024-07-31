import { difficultyMap } from '@/data/difficulty';
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
    appearance: JournalDataEncounterItemAppearance,
): [string[], string[]] {
    if (!appearance.difficulties) {
        return [[], []];
    }

    const ret: [string[], string[]] = [[], []];
    if (raidSizeInstances.has(instance.id)) {
        const normal10 = appearance.difficulties.includes(3);
        const normal25 = appearance.difficulties.includes(4);
        const heroic10 = appearance.difficulties.includes(5);
        const heroic25 = appearance.difficulties.includes(6);

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
        // LFR Legacy, LFR Raid
        if ([7, 17].some((id) => appearance.difficulties.indexOf(id) >= 0)) {
            ret[0].push(difficultyMap[17].shortName);
            ret[1].push(difficultyMap[17].name);
        }
        // Normal Dungeon, 10 Normal, 25 Normal, 40 Normal, Normal Raid
        if ([1, 3, 4, 9, 14].some((id) => appearance.difficulties.indexOf(id) >= 0)) {
            ret[0].push(difficultyMap[14].shortName);
            ret[1].push(difficultyMap[14].name);
        }
        // Heroic Dungeon, 10 Heroic, 25 Heroic, Heroic Raid
        if ([2, 5, 6, 15].some((id) => appearance.difficulties.indexOf(id) >= 0)) {
            ret[0].push(difficultyMap[15].shortName);
            ret[1].push(difficultyMap[15].name);
        }
        // Mythic Dungeon, Mythic Keystone, Mythic Raid
        if ([23, 8, 16].some((id) => appearance.difficulties.indexOf(id) >= 0)) {
            ret[0].push(difficultyMap[16].shortName);
            ret[1].push(difficultyMap[16].name);
        }
        // Timewalking Dungeon, Timewalking Raid
        if ([24, 33].some((id) => appearance.difficulties.indexOf(id) >= 0)) {
            ret[0].push(difficultyMap[33].shortName);
            ret[1].push(difficultyMap[33].name);
        }
    }
    return ret;
}
