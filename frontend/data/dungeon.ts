import {Dungeon, MythicPlusAffix, MythicPlusSeason} from '@/types'
import type { Dictionary, StaticDataInstance } from '@/types'

export const affixMap: Dictionary<MythicPlusAffix> = {
    1: new MythicPlusAffix('Overflowing'),
    2: new MythicPlusAffix('Skittish'),
    3: new MythicPlusAffix('Volcanic'),
    4: new MythicPlusAffix('Necrotic'),
    5: new MythicPlusAffix('Teeming'),
    6: new MythicPlusAffix('Raging'),
    7: new MythicPlusAffix('Bolstering'),
    8: new MythicPlusAffix('Sanguine'),
    9: new MythicPlusAffix('Tyrannical'),
    10: new MythicPlusAffix('Fortified'),
    11: new MythicPlusAffix('Bursting'),
    12: new MythicPlusAffix('Grievous'),
    13: new MythicPlusAffix('Explosive'),
    14: new MythicPlusAffix('Quaking'),
    122: new MythicPlusAffix('Inspiring'),
    123: new MythicPlusAffix('Spiteful'),
    124: new MythicPlusAffix('Storming'),
    // Seasonal
    16: new MythicPlusAffix('Infested'), // BfA S1
    117: new MythicPlusAffix('Reaping'), // BfA S2
    119: new MythicPlusAffix('Beguiling'), // BfA S3
    120: new MythicPlusAffix('Awakened'), // BfA S4
    121: new MythicPlusAffix('Prideful'), // SL S1
    128: new MythicPlusAffix('Tormented'), // SL S2
}

export const dungeonMap: Dictionary<Dungeon> = {
    // Battle for Azeroth
    244: new Dungeon(244, "Atal'Dazar", 'AD', 'dungeon_atal_dazar', 0),
    245: new Dungeon(245, 'Freehold', 'FH', 'dungeon_freehold', 0),
    246: new Dungeon(246, 'Tol Dagor', 'TD', 'dungeon_tol_dagor', 0),
    247: new Dungeon(
        247,
        'The MOTHERLODE!!',
        'ML',
        'dungeon_the_motherlode',
        0,
    ),
    248: new Dungeon(248, 'Waycrest Manor', 'WM', 'dungeon_waycrest_manor', 0),
    249: new Dungeon(249, "King's Rest", 'KR', 'dungeon_kings_rest', 0),
    250: new Dungeon(
        250,
        'Temple of Sethraliss',
        'ToS',
        'dungeon_temple_of_sethraliss',
        0,
    ),
    251: new Dungeon(251, 'The Underrot', 'UR', 'dungeon_the_underrot', 0),
    252: new Dungeon(
        252,
        'Shrine of the Storm',
        'SoS',
        'dungeon_shrine_of_the_storm',
        0,
    ),
    353: new Dungeon(
        353,
        'Siege of Boralus',
        'SoB',
        'dungeon_siege_of_boralus',
        0,
    ),
    369: new Dungeon(
        369,
        'Operation: Mechagon - Junkyard',
        'OMJ',
        'dungeon_operation_mechagon_junkyard',
        0,
    ),
    370: new Dungeon(
        370,
        'Operation: Mechagon - Workshop',
        'OMW',
        'dungeon_operation_mechagon_workshop',
        0,
    ),

    // Shadowlands
    375: new Dungeon(
        375,
        'Mists of Tirna Scithe',
        'MoTS',
        'dungeon_mists_of_tirna_scithe',
        30,
    ),
    376: new Dungeon(
        376,
        'The Necrotic Wake',
        'NW',
        'dungeon_the_necrotic_wake',
        36,
    ),
    377: new Dungeon(377, 'De Other Side', 'DOS', 'dungeon_de_other_side', 43),
    378: new Dungeon(
        378,
        'Halls of Atonement',
        'HoA',
        'dungeon_halls_of_atonement',
        31,
    ),
    379: new Dungeon(379, 'Plaguefall', 'PF', 'dungeon_plaguefall', 38),
    380: new Dungeon(
        380,
        'Sanguine Depths',
        'SD',
        'dungeon_sanguine_depths',
        41,
    ),
    381: new Dungeon(
        381,
        'Spires of Ascension',
        'SoA',
        'dungeon_spires_of_ascension',
        39,
    ),
    382: new Dungeon(
        382,
        'Theater of Pain',
        'ToP',
        'dungeon_theater_of_pain',
        37,
    ),
}

const orderBattleForAzeroth: number[] = [
    244, // Atal'Dazar
    245, // Freehold
    249, // King's Rest
    247, // The MOTHERLODE!!
    252, // Shrine of the Storm
    353, // Siege of Boralus
    250, // Temple of Sethraliss
    246, // Tol Dagor
    251, // The Underrot
    248, // Waycrest Manor
]

// 8.3 dungeons
const orderBattleForAzeroth2: number[] = [
    369, // Operation: Mechagon - Junkyard
    370, // Operation: Mechagon - Workshop
]

const orderShadowlands: number[] = [
    377, // De Other Side
    378, // Halls of Atonement
    375, // Mists of Tirna Scithe
    376, // The Necrotic Wake
    379, // Plaguefall
    380, // Sanguine Depths
    381, // Spires of Ascension
    382, // Theater of Pain
]

export const seasonMap: Dictionary<MythicPlusSeason> = {
    1: new MythicPlusSeason(1, 50, [orderBattleForAzeroth]),
    2: new MythicPlusSeason(2, 50, [orderBattleForAzeroth]),
    3: new MythicPlusSeason(3, 50, [orderBattleForAzeroth]),
    4: new MythicPlusSeason(4, 50, [
        orderBattleForAzeroth,
        orderBattleForAzeroth2,
    ]),
    5: new MythicPlusSeason(5, 60, [orderShadowlands]),
    6: new MythicPlusSeason(6, 60, [orderShadowlands]),
}

export const badgeToClass: Dictionary<string> = {
    2: 'quality1',
    5: 'quality2',
    10: 'quality3',
    15: 'quality4',
    20: 'quality5',
}

// [key level, item level] first match >= key is used
export const keyVaultItemLevel: Array<Array<number>> = [
    [15, 252],
    [14, 249],
    [12, 246],
    [11, 242],
    [10, 239],
    [8, 236],
    [7, 233],
    [5, 229],
    [2, 226],
]

export const raidVaultItemLevel: Dictionary<number> = {
    17: 213, // LFR
    14: 226, // Normal
    15: 239, // Heroic
    16: 252, // Mythic
}

export const extraInstanceMap: Dictionary<StaticDataInstance> = {
    108001: {
        expansion: 8,
        id: 108001,
        name: 'Shadowlands World Bosses',
        shortName: 'SWB',
    },
    108002: {
        expansion: 8,
        id: 108002,
        name: "Mor'geth, Tormentor of the Damned",
        shortName: 'MTD',
    },
}
