import { Dungeon, MythicPlusAffix, MythicPlusSeason } from '@/types'
import type { StaticDataInstance } from '@/types'

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
    ['Fortified', 'Spiteful', 'Grievous'],
    ['Tyrannical', 'Inspiring', 'Quaking'],
    ['Fortified', 'Sanguine', 'Necrotic'],
    ['Tyrannical', 'Bolstering', 'Explosive'],
].map((arr) => arr.map((affix) => affixNameMap[affix]))

export const dungeonMap: Record<number, Dungeon> = {
    // Battle for Azeroth
    244: new Dungeon(244, "Atal'Dazar", 'AD', 'dungeon_atal_dazar', 0),
    245: new Dungeon(245, 'Freehold', 'FH', 'dungeon_freehold', 0),
    246: new Dungeon(246, 'Tol Dagor', 'TD', 'dungeon_tol_dagor', 0),
    247: new Dungeon(
        247,
        'The MOTHERLODE!!',
        'ML',
        'dungeon_the_motherlode',
        0
    ),
    248: new Dungeon(248, 'Waycrest Manor', 'WM', 'dungeon_waycrest_manor', 0),
    249: new Dungeon(249, "King's Rest", 'KR', 'dungeon_kings_rest', 0),
    250: new Dungeon(
        250,
        'Temple of Sethraliss',
        'ToS',
        'dungeon_temple_of_sethraliss',
        0
    ),
    251: new Dungeon(251, 'The Underrot', 'UR', 'dungeon_the_underrot', 0),
    252: new Dungeon(
        252,
        'Shrine of the Storm',
        'SoS',
        'dungeon_shrine_of_the_storm',
        0
    ),
    353: new Dungeon(
        353,
        'Siege of Boralus',
        'SoB',
        'dungeon_siege_of_boralus',
        0
    ),
    369: new Dungeon(
        369,
        'Operation: Mechagon - Junkyard',
        'OMJ',
        'dungeon_operation_mechagon_junkyard',
        0
    ),
    370: new Dungeon(
        370,
        'Operation: Mechagon - Workshop',
        'OMW',
        'dungeon_operation_mechagon_workshop',
        0
    ),

    // Shadowlands
    375: new Dungeon(
        375,
        'Mists of Tirna Scithe',
        'MoTS',
        'dungeon_mists_of_tirna_scithe',
        30
    ),
    376: new Dungeon(
        376,
        'The Necrotic Wake',
        'NW',
        'dungeon_the_necrotic_wake',
        36
    ),
    377: new Dungeon(377, 'De Other Side', 'DOS', 'dungeon_de_other_side', 43),
    378: new Dungeon(
        378,
        'Halls of Atonement',
        'HoA',
        'dungeon_halls_of_atonement',
        31
    ),
    379: new Dungeon(379, 'Plaguefall', 'PF', 'dungeon_plaguefall', 38),
    380: new Dungeon(
        380,
        'Sanguine Depths',
        'SD',
        'dungeon_sanguine_depths',
        41
    ),
    381: new Dungeon(
        381,
        'Spires of Ascension',
        'SoA',
        'dungeon_spires_of_ascension',
        39
    ),
    382: new Dungeon(
        382,
        'Theater of Pain',
        'ToP',
        'dungeon_theater_of_pain',
        37
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

export const seasonMap: Record<number, MythicPlusSeason> = {
    6: new MythicPlusSeason(6, 'SL Season 2', 'sl-2', 60, [orderShadowlands]),
    5: new MythicPlusSeason(5, 'SL Season 1', 'sl-1', 60, [orderShadowlands]),
    4: new MythicPlusSeason(4, 'BfA Season 4', 'bfa-4', 50, [
        orderBattleForAzeroth2,
        orderBattleForAzeroth,
    ]),
    3: new MythicPlusSeason(3, 'BfA Season 3', 'bfa-3', 50, [
        orderBattleForAzeroth,
    ]),
    2: new MythicPlusSeason(2, 'BfA Season 2', 'bfa-2', 50, [
        orderBattleForAzeroth,
    ]),
    1: new MythicPlusSeason(1, 'BfA Season 1', 'bfa-1', 50, [
        orderBattleForAzeroth,
    ]),
}

export const badgeToClass: Record<number, string> = {
    2: 'quality1',
    5: 'quality2',
    10: 'quality3',
    15: 'quality4',
    20: 'quality5',
}

// [rating, max item level] first match >= rating is used
export const ratingItemLevelUpgrade: Array<Array<number>> = [
    [2000, 246],
    [1700, 242],
    [1400, 239],
    [1000, 236],
    [600, 229],
    [0, 226],
]

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

export const raidVaultItemLevel: Record<number, number> = {
    17: 213, // LFR
    14: 226, // Normal
    15: 239, // Heroic
    16: 252, // Mythic
}

// Fake "instances" for tracking world bosses
export const extraInstances: StaticDataInstance[] = [
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
]

export const extraInstanceMap: Record<number, StaticDataInstance> = Object.fromEntries(
    extraInstances.map((instance) => [instance.id, instance])
)
