import { Dungeon, MythicPlusSeason } from '@/types';
import type { StaticDataInstance } from '@/shared/stores/static/types';

export const weeklyAffixes: string[][] = [
    ['fortified', 'incorporeal', 'sanguine'],
    ['tyrannical', 'entangling', 'bursting'],
    ['fortified', 'volcanic', 'spiteful'],
    ['tyrannical', 'storming', 'raging'],
    ['fortified', 'entangling', 'bolstering'],
    ['tyrannical', 'incorporeal', 'spiteful'],
    ['fortified', 'afflicted', 'raging'],
    ['tyrannical', 'volcanic', 'sanguine'],
    ['fortified', 'storming', 'bursting'],
    ['tyrannical', 'afflicted', 'bolstering'],
];

// MapChallengeMode.db2
export const dungeons: Dungeon[] = [
    // Cataclysm
    new Dungeon(
        438,
        'The Vortex Pinnacle',
        'VP',
        'achievement/4847',
        1800 / 60,
    ),
    new Dungeon(
        456,
        'Throne of the Tides',
        'ToT',
        'achievement/4839',
        2040 / 60,
    ),

    // Mists of Pandaria
    new Dungeon(2, 'Temple of the Jade Serpent', 'TJS', 'achievement/6757', 30),

    // Warlords of Draenor
    new Dungeon(
        165,
        'Shadowmoon Burial Grounds',
        'SBG',
        'achievement/9041',
        33,
    ),
    new Dungeon(166, 'Grimrail Depot', 'GD', 'achievement/9043', 30),
    new Dungeon(168, 'The Everbloom', 'EB', 'achievement/9044', 1980 / 60),
    new Dungeon(169, 'Iron Docks', 'ID', 'achievement/9038', 32),

    // Legion
    new Dungeon(
        198,
        'Darkheart Thicket',
        'DHT',
        'achievement/10783',
        1800 / 60,
    ),
    new Dungeon(199, 'Black Rook Hold', 'BRH', 'achievement/10804', 2160 / 60),
    new Dungeon(200, 'Halls of Valor', 'HoV', 'achievement/10786', 38),
    new Dungeon(206, 'Neltharion's Lair', 'NL', 'achievement/10795', 33),
    new Dungeon(210, 'Court of Stars', 'CoS', 'achievement/10816', 30),
    new Dungeon(
        227,
        'Return to Karazhan: Lower',
        'LOWR',
        'achievement/11338', // Dine and Dash
        42,
    ),
    new Dungeon(
        234,
        'Return to Karazhan: Upper',
        'UPPR',
        'achievement/11429',
        35,
    ),

    // Battle for Azeroth
    new Dungeon(244, 'Atal'Dazar', 'AD', 'achievement/12824', 1800 / 60),
    new Dungeon(245, 'Freehold', 'FH', 'achievement/12831', 1860 / 60),
    new Dungeon(246, 'Tol Dagor', 'TD', 'achievement/12840', 2160 / 60),
    new Dungeon(247, 'The MOTHERLODE!!', 'ML', 'achievement/12844', 2340 / 60),
    new Dungeon(248, 'Waycrest Manor', 'WM', 'achievement/12483', 2220 / 60),
    new Dungeon(249, 'Kings' Rest', 'KR', 'achievement/12848', 2520 / 60),
    new Dungeon(
        250,
        'Temple of Sethraliss',
        'ToS',
        'achievement/12504',
        2160 / 60,
    ),
    new Dungeon(251, 'The Underrot', 'UR', 'achievement/12500', 1920 / 60),
    new Dungeon(
        252,
        'Shrine of the Storm',
        'SoS',
        'achievement/12835',
        2520 / 60,
    ),
    new Dungeon(353, 'Siege of Boralus', 'SoB', 'achievement/12847', 2160 / 60),
    new Dungeon(
        369,
        'Operation: Mechagon - Junkyard',
        'YARD',
        'achievement/15693',
        2280 / 60,
    ),
    new Dungeon(
        370,
        'Operation: Mechagon - Workshop',
        'WORK',
        'achievement/15693',
        1920 / 60,
    ),

    // Shadowlands
    new Dungeon(
        375,
        'Mists of Tirna Scithe',
        'MoTS',
        'dungeon_mists_of_tirna_scithe',
        30,
    ),
    new Dungeon(
        376,
        'The Necrotic Wake',
        'NW',
        'dungeon_the_necrotic_wake',
        36,
    ),
    new Dungeon(377, 'De Other Side', 'DOS', 'dungeon_de_other_side', 43),
    new Dungeon(
        378,
        'Halls of Atonement',
        'HoA',
        'dungeon_halls_of_atonement',
        31,
    ),
    new Dungeon(379, 'Plaguefall', 'PF', 'dungeon_plaguefall', 38),
    new Dungeon(380, 'Sanguine Depths', 'SD', 'dungeon_sanguine_depths', 41),
    new Dungeon(
        381,
        'Spires of Ascension',
        'SoA',
        'dungeon_spires_of_ascension',
        39,
    ),
    new Dungeon(382, 'Theater of Pain', 'ToP', 'dungeon_theater_of_pain', 37),
    new Dungeon(
        391,
        'Tazavesh: Streets of Wonder',
        'STRT',
        'achievement/15106', // Quality Control
        39,
    ),
    new Dungeon(
        392,
        'Tazavesh: So'leah's Gambit',
        'GMBT',
        'achievement/15177',
        30,
    ),

    // Dragonflight
    new Dungeon(399, 'Ruby Life Pools', 'RLP', 'achievement/16266', 30),
    new Dungeon(400, 'The Nokhud Offensive', 'NO', 'achievement/16277', 40),
    new Dungeon(401, 'The Azure Vaults', 'AV', 'achievement/16272', 35.5),
    new Dungeon(402, 'Algeth'ar Academy', 'AA', 'achievement/16271', 32),
    new Dungeon(
        403,
        'Uldaman: Legacy of Tyr',
        'ULD',
        'achievement/16278',
        2280 / 60,
    ),
    new Dungeon(404, 'Neltharus', 'NELT', 'achievement/16263', 1980 / 60),
    new Dungeon(
        405,
        'Brackenhide Hollow',
        'BH',
        'achievement/16255',
        2100 / 60,
    ),
    new Dungeon(
        406,
        'Halls of Infusion',
        'HOI',
        'achievement/16260',
        2100 / 60,
    ),
    new Dungeon(
        463,
        'Dawn of the Infinite: Galakrond's Fall',
        'FALL',
        'achievement/18703',
        2100 / 60,
    ),
    new Dungeon(
        464,
        'Dawn of the Infinite: Murozond's Rise',
        'RISE',
        'achievement/6150',
        2280 / 60,
    ),
];

export const dungeonMap: Record<number, Dungeon> = Object.fromEntries(
    dungeons.map((dungeon) => [dungeon.id, dungeon]),
);

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
];

// 8.3
const orderBattleForAzeroth2: number[] = [
    369, // Operation: Mechagon - Junkyard
    370, // Operation: Mechagon - Workshop
];

const orderShadowlands: number[] = [
    377, // De Other Side
    378, // Halls of Atonement
    375, // Mists of Tirna Scithe
    376, // The Necrotic Wake
    379, // Plaguefall
    380, // Sanguine Depths
    381, // Spires of Ascension
    382, // Theater of Pain
];

const orderShadowlandsS3: number[] = orderShadowlands.concat([
    392, // Tazavesh: So'leah's Gambit
    391, // Tazavesh: Streets of Wonder
]);

const orderShadowlandsS4: number[] = [
    166, // Grimrail Depot
    169, // Iron Docks
    227, // Return to Karazhan: Lower
    234, // Return to Karazhan: Upper
    369, // Operation: Mechagon - Junkyard
    370, // Operation: Mechagon - Workshop
    392, // Tazavesh: So'leah's Gambit
    391, // Tazavesh: Streets of Wonder
];

const orderDragonflightS1: number[] = [
    402, // Algeth'ar Academy
    401, // The Azure Vault
    400, // The Nokhud Offensive
    399, // Ruby Life Pools
    210, // Court of Stars
    200, // Halls of Valor
    165, // Shadowmoon Burial Grounds
    2, // Temple of the Jade Serpent
];

const orderDragonflightS2: number[] = [
    405, // Brackenhide Hollow
    406, // Halls of Infusion
    404, // Neltharus
    403, // Uldaman: Legacy of Tyr
    245, // Freehold
    206, // Neltharion's Lair
    251, // The Underrot
    438, // The Vortex Pinnacle
];

const orderDragonflightS3: number[] = [
    463, // Dawn of the Infinite: Galakrond's Fall
    464, // Dawn of the Infinite: Murozond's Rise
    199, // Black Rook Hold
    198, // Darkheart Thicket
    244, // Atal'Dazar
    248, // Waycrest Manor
    168, // Everbloom
    456, // Throne of the Tides
];

const orderDragonflightS4: number[] = [
    402, // Algeth'ar Academy
    401, // The Azure Vault
    405, // Brackenhide Hollow
    406, // Halls of Infusion
    404, // Neltharus
    400, // The Nokhud Offensive
    399, // Ruby Life Pools
    403, // Uldaman: Legacy of Tyr
];

export const seasonMap: Record<number, MythicPlusSeason> = Object.fromEntries(
    [
        new MythicPlusSeason(
            12,
            '[DF] Season 4',
            'dragonflight-4',
            70,
            [orderDragonflightS4],
            956, // 2024-04-23
        ),
        new MythicPlusSeason(
            11,
            '[DF] Season 3',
            'dragonflight-3',
            70,
            [orderDragonflightS3],
            933, // 2023-11-14
        ),
        new MythicPlusSeason(
            10,
            '[DF] Season 2',
            'dragonflight-2',
            70,
            [orderDragonflightS2],
            906, // 2023-05-09
        ),
        new MythicPlusSeason(
            9,
            '[DF] Season 1',
            'dragonflight-1',
            70,
            [orderDragonflightS1],
            885, // 2022-12-13
        ),
        new MythicPlusSeason(
            8,
            '[SL] Season 4',
            'shadowlands-4',
            60,
            [orderShadowlandsS4],
            866, // 2022-08-02
        ),
        new MythicPlusSeason(7, '[SL] Season 3', 'shadowlands-3', 60, [
            orderShadowlandsS3,
        ]),
        new MythicPlusSeason(6, '[SL] Season 2', 'shadowlands-2', 60, [
            orderShadowlands,
        ]),
        new MythicPlusSeason(5, '[SL] Season 1', 'shadowlands-1', 60, [
            orderShadowlands,
        ]),
        new MythicPlusSeason(4, '[BfA] Season 4', 'battle-for-azeroth-4', 50, [
            orderBattleForAzeroth,
            orderBattleForAzeroth2,
        ]),
        new MythicPlusSeason(3, '[BfA] Season 3', 'battle-for-azeroth-3', 50, [
            orderBattleForAzeroth,
        ]),
        new MythicPlusSeason(2, '[BfA] Season 2', 'battle-for-azeroth-2', 50, [
            orderBattleForAzeroth,
        ]),
        new MythicPlusSeason(1, '[BfA] Season 1', 'battle-for-azeroth-1', 50, [
            orderBattleForAzeroth,
        ]),
    ].map((season) => [season.id, season]),
);

// [key level, item level] first match >= key is used
export const keyVaultItemLevel: Array<Array<number>> = [
    [10, 522, 5],
    [8, 519, 5],
    [6, 515, 4],
    [4, 512, 4],
    [2, 509, 4],
    [0, 506, 4],
    [-1, 489, 2],
];

export const raidVaultItemLevel: Record<number, Array<number>> = {
    17: [480, 2], // LFR
    14: [493, 3], // Normal
    15: [506, 4], // Heroic
    16: [519, 5], // Mythic
};

export const keyTiers = [
    '2-5',
    '6-10',
    '11-15',
    '16-20',
    '21-25',
    '26-30',
    '31+',
];

// Fake 'instances' for tracking world bosses
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
    {
        expansion: 4,
        id: 104005,
        name: 'The Four Celestials',
        shortName: 'Cel',
    },
    {
        expansion: 4,
        id: 104006,
        name: 'Ordos',
        shortName: 'Ord',
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
        name: 'Mor'geth, Tormentor of the Damned',
        shortName: 'MTD',
    },
    {
        expansion: 8,
        id: 108005,
        name: 'Antros',
        shortName: 'Ant',
    },

    // Dragonflight
    {
        expansion: 9,
        id: 109001,
        name: 'Dragonflight World Bosses',
        shortName: 'DWB',
    },
    {
        expansion: 9,
        id: 109002,
        name: 'The Zaqali Elders',
        shortName: 'TZE',
    },
    {
        expansion: 9,
        id: 109003,
        name: 'Aurostor, The Hibernator',
        shortName: 'AtH',
    },

    // Holidays
    {
        expansion: 100,
        id: 200285,
        name: 'The Headless Horseman',
        shortName: 'HH',
    },
    {
        expansion: 100,
        id: 200286,
        name: 'The Frost Lord Ahune',
        shortName: 'FLA',
    },
    {
        expansion: 100,
        id: 200287,
        name: 'Coren Direbrew',
        shortName: 'CD',
    },
    {
        expansion: 100,
        id: 200288,
        name: 'The Crown Chemical Co.',
        shortName: 'CCC',
    },

    // Anniversary
    {
        expansion: 100,
        id: 100001,
        name: 'Lord Kazzak',
        shortName: 'LK',
    },
    {
        expansion: 100,
        id: 100002,
        name: 'Azuregos',
        shortName: 'Azu',
    },
    {
        expansion: 100,
        id: 100003,
        name: 'Dragon of Nightmare',
        shortName: 'DoN',
    },
    {
        expansion: 100,
        id: 100017,
        name: 'Doomwalker',
        shortName: 'DW',
    },
];

export const extraInstanceMap: Record<number, StaticDataInstance> =
    Object.fromEntries(
        extraInstances.map((instance) => [instance.id, instance]),
    );

export const lockoutOverride: Record<number, number> = {
    777: 3, // Legion: Assault on Violet Hold
};

export const worldBossInstanceIds: number[] = [
    322, // Mists of Pandaria
    557, // Warlords of Draenor
    822, // Legion
    1028, // Battle for Azeroth
    1192, // Shadowlands
    1205, // Dragonflight
];

export const ignoredLockoutInstances: Record<number, boolean> =
    Object.fromEntries(
        [
            1192, // Shadowlands
            1205, // Dragon Isles
        ].map((id) => [id, true]),
    );
