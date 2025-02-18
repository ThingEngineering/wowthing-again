import { InstanceType } from '@/enums/instance-type'
import { Difficulty } from '@/types'


export const difficultyMap: Record<number, Difficulty> = {
    0: new Difficulty(0, 'World Boss', 'WB', InstanceType.Raid, 1, 40),

    // Dungeons
    1: new Difficulty(1, 'Normal', 'N', InstanceType.Dungeon, 5, 5),
    2: new Difficulty(2, 'Heroic', 'H', InstanceType.Dungeon, 5, 5),
    8: new Difficulty(8, 'Mythic Keystone', 'M', InstanceType.Dungeon, 5, 5),
    23: new Difficulty(23, 'Mythic', 'M', InstanceType.Dungeon, 5, 5),
    24: new Difficulty(24, 'Timewalking', 'T', InstanceType.Dungeon, 5, 5),

    // Legacy Raids
    3: new Difficulty(3, '10 Normal', '10N', InstanceType.Raid, 10, 10),
    4: new Difficulty(4, '25 Normal', '25N', InstanceType.Raid, 25, 25),
    5: new Difficulty(5, '10 Heroic', '10H', InstanceType.Raid, 10, 10),
    6: new Difficulty(6, '25 Heroic', '25H', InstanceType.Raid, 25, 25),
    7: new Difficulty(7, 'Looking For Raid', 'L', InstanceType.Raid, 25, 25),
    9: new Difficulty(9, '40 Player', '40', InstanceType.Raid, 40, 40),

    // Raids
    14: new Difficulty(14, 'Normal', 'N', InstanceType.Raid, 10, 30),
    15: new Difficulty(15, 'Heroic', 'H', InstanceType.Raid, 10, 30),
    16: new Difficulty(16, 'Mythic', 'M', InstanceType.Raid, 20, 20),
    17: new Difficulty(17, 'Looking For Raid', 'L', InstanceType.Raid, 10, 30),
    18: new Difficulty(18, 'Event?', 'E', InstanceType.Raid, 40, 40),
    33: new Difficulty(33, 'Timewalking', 'T', InstanceType.Raid, 10, 30),
}

export const dungeonDifficulties = Object.values(difficultyMap)
    .filter((diff) => diff.instanceType === InstanceType.Dungeon)
    .map((diff) => diff.id)

export const raidDifficulties = Object.values(difficultyMap)
    .filter((diff) => diff.instanceType === InstanceType.Raid)
    .map((diff) => diff.id)

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
]

export const journalDifficultyMap: Record<number, number> = Object.fromEntries(
    journalDifficultyOrder.map((value, index) => [value, index])
)

export const lockoutDifficultyOrder: number[] = [
    16, // Raid Mythic
    15, // Raid Heroic
    14, // Raid Normal
    17, // Raid LFR
    
    6, // Legacy 25 Heroic
    5, // Legacy 10 Heroic
    9, // Legacy 40 Player
    4, // Legacy 25 Normal
    3, // Legacy 10 Normal
    7, // Legacy LFR

    23, // Dungeon Mythic
    2, // Dungeon Heroic
    1, // Dungeon Normal

    0, // World Boss
]

export const lockoutDifficultyOrderMap: Record<number, number> = Object.fromEntries(
    lockoutDifficultyOrder.map((value, index) => [value, index])
)
