import {Difficulty} from '@/types'
import {InstanceType} from '@/types/enums'

export const difficultyMap: Record<number, Difficulty> = {
    0: new Difficulty(0, 'World Boss', 'W', InstanceType.Raid, 1, 40),

    // Dungeons
    1: new Difficulty(1, 'Normal', 'N', InstanceType.Dungeon, 5, 5),
    2: new Difficulty(2, 'Heroic', 'H', InstanceType.Dungeon, 5, 5),
    23: new Difficulty(23, 'Mythic', 'M', InstanceType.Dungeon, 5, 5),

    // Legacy Raids
    3: new Difficulty(3, '10 Normal', '10N', InstanceType.Raid, 10, 10),
    4: new Difficulty(4, '25 Normal', '25N', InstanceType.Raid, 25, 25),
    5: new Difficulty(5, '10 Heroic', '10H', InstanceType.Raid, 10, 10),
    6: new Difficulty(6, '25 Heroic', '25H', InstanceType.Raid, 25, 25),
    9: new Difficulty(9, '40 Player', '40', InstanceType.Raid, 40, 40),

    // Raids
    14: new Difficulty(14, 'Normal', 'N', InstanceType.Raid, 10, 30),
    15: new Difficulty(15, 'Heroic', 'H', InstanceType.Raid, 10, 30),
    16: new Difficulty(16, 'Mythic', 'M', InstanceType.Raid, 20, 20),
    17: new Difficulty(17, 'Looking For Raid', 'L', InstanceType.Raid, 10, 30),
}
