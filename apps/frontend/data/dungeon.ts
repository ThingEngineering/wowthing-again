import { Dungeon, MythicPlusAffix, MythicPlusSeason } from '@/types'
import type { StaticDataInstance } from '@/types/data/static'


export const affixMap: Record<number, MythicPlusAffix> = Object.fromEntries(
    [
        new MythicPlusAffix(0, 'Unknown'),
        // Always
        new MythicPlusAffix(9, 'Tyrannical'),
        new MythicPlusAffix(10, 'Fortified'),
        // Set A
        new MythicPlusAffix(6, 'Raging'),
        new MythicPlusAffix(11, 'Bursting'),
        new MythicPlusAffix(122, 'Inspiring'),
        new MythicPlusAffix(123, 'Spiteful'),
        new MythicPlusAffix(7, 'Bolstering'),
        new MythicPlusAffix(8, 'Sanguine'),
        // Set B
        new MythicPlusAffix(3, 'Volcanic'),
        new MythicPlusAffix(4, 'Necrotic'),
        new MythicPlusAffix(12, 'Grievous'),
        new MythicPlusAffix(13, 'Explosive'),
        new MythicPlusAffix(14, 'Quaking'),
        new MythicPlusAffix(124, 'Storming'),
        // Retired
        new MythicPlusAffix(1, 'Overflowing'),
        new MythicPlusAffix(2, 'Skittish'),
        new MythicPlusAffix(5, 'Teeming'),
        // Seasonal
        new MythicPlusAffix(16, 'Infested'), // BfA S1
        new MythicPlusAffix(117, 'Reaping'), // BfA S2
        new MythicPlusAffix(119, 'Beguiling'), // BfA S3
        new MythicPlusAffix(120, 'Awakened'), // BfA S4
        new MythicPlusAffix(121, 'Prideful'), // SL S1
        new MythicPlusAffix(128, 'Tormented'), // SL S2
        new MythicPlusAffix(129, 'Infernal'), // Legion TW S1
        new MythicPlusAffix(130, 'Encrypted'), // SL S3
    ].map((affix) => [affix.id, affix])
)

const affixNameMap = Object.fromEntries(
    Object.entries(affixMap).map(([, affix]) => [affix.name, affix])
)

export const weeklyAffixes: MythicPlusAffix[][] = [
    ['Fortified', 'Bursting', 'Storming'],
    ['Tyrannical', 'Raging', 'Volcanic'],
    ['Fortified', 'Inspiring', 'Grievous'],
    ['Tyrannical', 'Spiteful', 'Necrotic'],
    ['Fortified', 'Bolstering', 'Quaking'],
    ['Tyrannical', 'Sanguine', 'Storming'],
    ['Fortified', 'Raging', 'Explosive'],
    ['Tyrannical', 'Bursting', 'Volcanic'],
    ['Fortified', 'Spiteful', 'Necrotic'],
    ['Tyrannical', 'Inspiring', 'Quaking'],
    ['Fortified', 'Sanguine', 'Grievous'],
    ['Tyrannical', 'Bolstering', 'Explosive'],
].map((arr) => arr.map((affix) => affixNameMap[affix]))

// MapChallengeMode.db2
export const dungeons: Dungeon[] = [
    // Warlords of Draenor
    new Dungeon(
        166,
        'Grimrail Depot',
        'GD',
        'achievement/9043',
        30
    ),
    new Dungeon(
        169,
        'Iron Docks',
        'ID',
        'achievement/9038',
        32
    ),
    // Legion
    new Dungeon(
        227,
        'Return to Karazhan: Lower',
        'RKL',
        'achievement/11338', // Dine and Dash
        42
    ),
    new Dungeon(
        234,
        'Return to Karazhan: Upper',
        'RKU',
        'achievement/11429',
        35
    ),
    // Battle for Azeroth
    new Dungeon(
        244,
        "Atal'Dazar",
        'AD',
        'dungeon_atal_dazar',
        0
    ),
    new Dungeon(
        245,
        'Freehold',
        'FH',
        'dungeon_freehold',
        0
    ),
    new Dungeon(
        246,
        'Tol Dagor',
        'TD',
        'dungeon_tol_dagor',
        0
    ),
    new Dungeon(
        247,
        'The MOTHERLODE!!',
        'ML',
        'dungeon_the_motherlode',
        0
    ),
    new Dungeon(
        248,
        'Waycrest Manor',
        'WM',
        'dungeon_waycrest_manor',
        0
    ),
    new Dungeon(
        249,
        "King's Rest",
        'KR',
        'dungeon_kings_rest',
        0
    ),
    new Dungeon(
        250,
        'Temple of Sethraliss',
        'ToS',
        'dungeon_temple_of_sethraliss',
        0
    ),
    new Dungeon(
        251,
        'The Underrot',
        'UR',
        'dungeon_the_underrot',
        0
    ),
    new Dungeon(
        252,
        'Shrine of the Storm',
        'SoS',
        'dungeon_shrine_of_the_storm',
        0
    ),
    new Dungeon(
        353,
        'Siege of Boralus',
        'SoB',
        'dungeon_siege_of_boralus',
        0
    ),
    new Dungeon(
        369,
        'Operation: Mechagon - Junkyard',
        'OMJ',
        'dungeon_operation_mechagon_junkyard',
        0
    ),
    new Dungeon(
        370,
        'Operation: Mechagon - Workshop',
        'OMW',
        'dungeon_operation_mechagon_workshop',
        0
    ),

    // Shadowlands
    new Dungeon(
        375,
        'Mists of Tirna Scithe',
        'MoTS',
        'dungeon_mists_of_tirna_scithe',
        30
    ),
    new Dungeon(
        376,
        'The Necrotic Wake',
        'NW',
        'dungeon_the_necrotic_wake',
        36
    ),
    new Dungeon(
        377,
        'De Other Side',
        'DOS',
        'dungeon_de_other_side',
        43
    ),
    new Dungeon(
        378,
        'Halls of Atonement',
        'HoA',
        'dungeon_halls_of_atonement',
        31
    ),
    new Dungeon(
        379, 'Plaguefall',
        'PF',
        'dungeon_plaguefall',
        38
    ),
    new Dungeon(
        380,
        'Sanguine Depths',
        'SD',
        'dungeon_sanguine_depths',
        41
    ),
    new Dungeon(
        381,
        'Spires of Ascension',
        'SoA',
        'dungeon_spires_of_ascension',
        39
    ),
    new Dungeon(
        382,
        'Theater of Pain',
        'ToP',
        'dungeon_theater_of_pain',
        37
    ),
    new Dungeon(
        391,
        'Tazavesh: Streets of Wonder',
        'TSW',
        'achievement/15106', // Quality Control
        39
    ),
    new Dungeon(
        392,
        "Tazavesh: So'leah's Gambit",
        'TSG',
        'achievement/15177',
        30
    ),
]

export const dungeonMap: Record<number, Dungeon> = Object.fromEntries(
    dungeons.map((dungeon) => [dungeon.id, dungeon])
)

// 8.0
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

// 8.3
const orderBattleForAzeroth2: number[] = [
    369, // Operation: Mechagon - Junkyard
    370, // Operation: Mechagon - Workshop
]

// 9.0
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

// 9.2
const orderShadowlands2: number[] = [
    392, // Tazavesh: So'leah's Gambit
    391, // Tazavesh: Streets of Wonder
]

// 9.2.7
const orderShadowlandsS4: number[] = [
    166, // Grimrail Depot
    169, // Iron Docks
    227, // Return to Karazhan: Lower
    234, // Return to Karazhan: Upper
    369, // Operation: Mechagon - Junkyard
    370, // Operation: Mechagon - Workshop
    392, // Tazavesh: So'leah's Gambit
    391, // Tazavesh: Streets of Wonder
]

export const seasonMap: Record<number, MythicPlusSeason> = {
    8: new MythicPlusSeason(8, 'SL Season 4', 'sl-4', 60, [orderShadowlandsS4]),
    7: new MythicPlusSeason(7, 'SL Season 3', 'sl-3', 60, [orderShadowlands, orderShadowlands2]),
    6: new MythicPlusSeason(6, 'SL Season 2', 'sl-2', 60, [orderShadowlands]),
    5: new MythicPlusSeason(5, 'SL Season 1', 'sl-1', 60, [orderShadowlands]),
    4: new MythicPlusSeason(4, 'BfA Season 4', 'bfa-4', 50, [orderBattleForAzeroth, orderBattleForAzeroth2]),
    3: new MythicPlusSeason(3, 'BfA Season 3', 'bfa-3', 50, [orderBattleForAzeroth]),
    2: new MythicPlusSeason(2, 'BfA Season 2', 'bfa-2', 50, [orderBattleForAzeroth]),
    1: new MythicPlusSeason(1, 'BfA Season 1', 'bfa-1', 50, [orderBattleForAzeroth]),
}

// [rating, max item level] first match >= rating is used
export const ratingItemLevelUpgrade: Array<Array<number>> = [
    [2000, 272],
    [1700, 268],
    [1400, 265],
    [1200, 262],
    [1000, 259],
    [600, 255],
    [0, 252],
]

// [key level, item level] first match >= key is used
export const keyVaultItemLevel: Array<Array<number>> = [
    [15, 278],
    [14, 275],
    [12, 272],
    [11, 268],
    [10, 265],
    [8, 262],
    [7, 259],
    [5, 255],
    [2, 252],
]

export const raidVaultItemLevel: Record<number, number> = {
    17: 239, // LFR
    14: 252, // Normal
    15: 265, // Heroic
    16: 278, // Mythic
}

export const keyTiers = [
    '2-4',
    '5-9',
    '10-14',
    '15-19',
    '20-24',
    '25-29',
    '30+',
]

// Fake "instances" for tracking world bosses
export const extraInstances: StaticDataInstance[] = [
    // Anniversary bosses
    {
        expansion: 1,
        id: 100017,
        name: 'Doomwalker',
        shortName: 'DW',
    },

    // Mists of Pandaria
    {
        expansion: 4,
        id: 104001,
        name: 'Sha of Anger',
        shortName: 'Sha',
    },
    {
        expansion: 4,
        id: 104002,
        name: 'Galleon',
        shortName: 'Gal',
    },
    {
        expansion: 4,
        id: 104003,
        name: 'Nalak',
        shortName: 'Nal',
    },
    {
        expansion: 4,
        id: 104004,
        name: 'Oondasta',
        shortName: 'Oon',
    },

    // Warlords of Draenor
    {
        expansion: 5,
        id: 105001,
        name: 'Gorgrond World Bosses',
        shortName: 'Gor',
    },
    {
        expansion: 5,
        id: 105002,
        name: 'Rukhmar',
        shortName: 'Ruk',
    },
    {
        expansion: 5,
        id: 105003,
        name: 'Supreme Lord Kazzak',
        shortName: 'SLK',
    },

    // Legion
    {
        expansion: 6,
        id: 106001,
        name: 'Legion World Bosses',
        shortName: 'Leg',
    },
    {
        expansion: 6,
        id: 106002,
        name: 'Broken Shore World Bosses',
        shortName: 'BrS',
    },
    {
        expansion: 6,
        id: 106003,
        name: 'Argus Greater Invasions',
        shortName: 'Arg',
    },

    // Battle for Azeroth
    {
        expansion: 7,
        id: 107001,
        name: 'Battle for Azeroth World Bosses',
        shortName: 'BfA',
    },
    {
        expansion: 7,
        id: 107002,
        name: 'Arathi World Bosses',
        shortName: 'ArH',
    },
    {
        expansion: 7,
        id: 107003,
        name: 'Darkshore World Bosses',
        shortName: 'Dar',
    },
    {
        expansion: 7,
        id: 107004,
        name: 'Nazjatar World Bosses',
        shortName: 'Naz',
    },
    {
        expansion: 7,
        id: 107005,
        name: 'Uldum World Bosses',
        shortName: 'Uld',
    },
    {
        expansion: 7,
        id: 107006,
        name: 'Vale of Eternal Blossoms World Bosses',
        shortName: 'VEB',
    },

    // Shadowlands
    {
        expansion: 8,
        id: 108001,
        name: 'Shadowlands World Bosses',
        shortName: 'SWB',
    },
    {
        expansion: 8,
        id: 108002,
        name: 'Wrath of the Jailer',
        shortName: 'WotJ',
    },
    {
        expansion: 8,
        id: 108003,
        name: 'Tormentors of Torghast',
        shortName: 'ToT',
    },
    {
        expansion: 8,
        id: 108004,
        name: "Mor'geth, Tormentor of the Damned",
        shortName: 'MTD',
    },
    {
        expansion: 8,
        id: 108005,
        name: 'Antros',
        shortName: 'Ant',
    },

    // Holidays
    {
        expansion: 0,
        id: 200285,
        name: "The Headless Horseman",
        shortName: 'HH',
    },
    {
        expansion: 0,
        id: 200286,
        name: "The Frost Lord Ahune",
        shortName: 'FLA',
    },
    {
        expansion: 0,
        id: 200287,
        name: "Coren Direbrew",
        shortName: 'CD',
    },
    {
        expansion: 0,
        id: 200288,
        name: "The Crown Chemical Co.",
        shortName: 'CCC',
    },
]

export const extraInstanceMap: Record<number, StaticDataInstance> = Object.fromEntries(
    extraInstances.map((instance) => [instance.id, instance])
)

export const lockoutOverride: Record<number, number> = {
    777: 3, // Legion: Assault on Violet Hold
}
