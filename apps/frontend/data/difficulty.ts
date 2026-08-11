import { Difficulty } from '@/enums/difficulty';
import { InstanceType } from '@/enums/instance-type';
import { DifficultyData } from '@/types';

export const difficulties: DifficultyData[] = [
    new DifficultyData(Difficulty.WorldBoss, 'World Boss', 'WB', InstanceType.Raid, 1, 40),

    // Dungeons
    new DifficultyData(Difficulty.DungeonNormal, 'Normal', 'N', InstanceType.Dungeon, 5, 5),
    new DifficultyData(Difficulty.DungeonHeroic, 'Heroic', 'H', InstanceType.Dungeon, 5, 5),
    new DifficultyData(
        Difficulty.DungeonMythicKeystone,
        'Mythic Keystone',
        'M',
        InstanceType.Dungeon,
        5,
        5
    ),
    new DifficultyData(Difficulty.DungeonMythic, 'Mythic', 'M', InstanceType.Dungeon, 5, 5),
    new DifficultyData(
        Difficulty.DungeonTimewalking,
        'Timewalking',
        'T',
        InstanceType.Dungeon,
        5,
        5
    ),

    // Legacy Raids
    new DifficultyData(
        Difficulty.RaidLegacy10Normal,
        '10 Normal',
        '10N',
        InstanceType.Raid,
        10,
        10
    ),
    new DifficultyData(
        Difficulty.RaidLegacy25Normal,
        '25 Normal',
        '25N',
        InstanceType.Raid,
        25,
        25
    ),
    new DifficultyData(
        Difficulty.RaidLegacy10Heroic,
        '10 Heroic',
        '10H',
        InstanceType.Raid,
        10,
        10
    ),
    new DifficultyData(
        Difficulty.RaidLegacy25Heroic,
        '25 Heroic',
        '25H',
        InstanceType.Raid,
        25,
        25
    ),
    new DifficultyData(
        Difficulty.RaidLegacyLookingForRaid,
        'Looking For Raid',
        'L',
        InstanceType.Raid,
        25,
        25
    ),
    new DifficultyData(Difficulty.RaidLegacy40, '40 Player', '40', InstanceType.Raid, 40, 40),

    // Raids
    new DifficultyData(Difficulty.RaidNormal, 'Normal', 'N', InstanceType.Raid, 10, 30),
    new DifficultyData(Difficulty.RaidHeroic, 'Heroic', 'H', InstanceType.Raid, 10, 30),
    new DifficultyData(Difficulty.RaidMythic, 'Mythic', 'M', InstanceType.Raid, 20, 20),
    new DifficultyData(
        Difficulty.RaidLookingForRaid,
        'Looking For Raid',
        'L',
        InstanceType.Raid,
        10,
        30
    ),
    new DifficultyData(Difficulty.RaidEvent, 'Event?', 'E', InstanceType.Raid, 40, 40),
    new DifficultyData(Difficulty.RaidTimewalking, 'Timewalking', 'T', InstanceType.Raid, 10, 30),
    new DifficultyData(Difficulty.RaidMythicFlex, 'Mythic Flex', 'MF', InstanceType.Raid, 15, 25),
    new DifficultyData(Difficulty.RaidWorld, 'World', 'W', InstanceType.Raid, 5, 40),
];

export const difficultyMap: Record<number, DifficultyData> = Object.fromEntries(
    difficulties.map((data) => [data.id, data])
);

export const dungeonDifficulties = Object.values(difficultyMap)
    .filter((diff) => diff.instanceType === InstanceType.Dungeon)
    .map((diff) => diff.id);

export const raidDifficulties = Object.values(difficultyMap)
    .filter((diff) => diff.instanceType === InstanceType.Raid)
    .map((diff) => diff.id);

export const difficultyWorld = [Difficulty.WorldBoss, Difficulty.RaidWorld];
export const difficultyLookingForRaid = [
    Difficulty.RaidLegacyLookingForRaid,
    Difficulty.RaidLookingForRaid,
];
export const difficultyNormal = [
    Difficulty.DungeonNormal,
    Difficulty.RaidLegacy10Normal,
    Difficulty.RaidLegacy25Normal,
    Difficulty.RaidLegacy40,
    Difficulty.RaidNormal,
];
export const difficultyHeroic = [
    Difficulty.DungeonHeroic,
    Difficulty.RaidLegacy10Heroic,
    Difficulty.RaidLegacy25Heroic,
    Difficulty.RaidHeroic,
];
export const difficultyMythic = [
    Difficulty.DungeonMythic,
    Difficulty.DungeonMythicKeystone,
    Difficulty.RaidMythic,
    Difficulty.RaidMythicFlex,
];
export const difficultyTimewalking = [Difficulty.DungeonTimewalking, Difficulty.RaidTimewalking];

export const journalDifficultyOrder: number[] = [
    Difficulty.DungeonNormal,
    Difficulty.DungeonHeroic,
    Difficulty.DungeonMythic,
    Difficulty.DungeonMythicKeystone,
    Difficulty.DungeonTimewalking,

    Difficulty.RaidLegacyLookingForRaid,
    Difficulty.RaidLegacy10Normal,
    Difficulty.RaidLegacy10Heroic,
    Difficulty.RaidLegacy25Normal,
    Difficulty.RaidLegacy25Heroic,
    Difficulty.RaidLegacy40,

    Difficulty.RaidLookingForRaid,
    Difficulty.RaidWorld,
    Difficulty.RaidNormal,
    Difficulty.RaidHeroic,
    Difficulty.RaidMythic,
    Difficulty.RaidMythicFlex,
    Difficulty.RaidTimewalking,
];

export const journalDifficultyMap: Record<number, number> = Object.fromEntries(
    journalDifficultyOrder.map((value, index) => [value, index])
);

export const lockoutDifficultyOrder: number[] = [
    Difficulty.RaidMythic,
    Difficulty.RaidMythicFlex,
    Difficulty.RaidHeroic,
    Difficulty.RaidLegacy25Heroic,
    Difficulty.RaidLegacy10Heroic,
    Difficulty.RaidNormal,
    Difficulty.RaidLegacy25Normal,
    Difficulty.RaidLegacy10Normal,
    Difficulty.RaidWorld,
    Difficulty.RaidLookingForRaid,
    Difficulty.RaidLegacyLookingForRaid,

    Difficulty.DungeonMythic,
    Difficulty.DungeonHeroic,
    Difficulty.DungeonNormal,

    Difficulty.WorldBoss,
];

export const lockoutDifficultyOrderMap: Record<number, number> = Object.fromEntries(
    lockoutDifficultyOrder.map((value, index) => [value, index + 1])
);
