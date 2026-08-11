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

export const journalDifficultyOrder: number[] = [
    1, // Dungeon Normal
    2, // Dungeon Heroic
    23, // Dungeon Mythic
    8, // Dungeon Mythic Keystone
    24, // Dungeon Timewalking

    7, // Legacy LFR
    3, // Legacy 10 Normal
    5, // Legacy 10 Heroic
    4, // Legacy 25 Normal
    6, // Legacy 25 Heroic
    9, // Legacy 40 Player

    17, // Raid LFR
    14, // Raid Normal
    15, // Raid Heroic
    16, // Raid Mythic
    33, // Raid Timewalking
];

export const journalDifficultyMap: Record<number, number> = Object.fromEntries(
    journalDifficultyOrder.map((value, index) => [value, index])
);

export const lockoutDifficultyOrder: number[] = [
    16, // Raid Mythic
    15, // Raid Heroic
    6, // Legacy 25 Heroic
    5, // Legacy 10 Heroic
    14, // Raid Normal
    9, // Legacy 40 Player
    4, // Legacy 25 Normal
    3, // Legacy 10 Normal
    17, // Raid LFR
    7, // Legacy LFR

    23, // Dungeon Mythic
    2, // Dungeon Heroic
    1, // Dungeon Normal

    0, // World Boss
];

export const lockoutDifficultyOrderMap: Record<number, number> = Object.fromEntries(
    lockoutDifficultyOrder.map((value, index) => [value, index + 1])
);
