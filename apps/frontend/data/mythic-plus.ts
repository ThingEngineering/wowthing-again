import { MythicPlusSeason } from '@/types';

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

const orderWarWithinS1: number[] = [
    503, // Ara-Kara, City of Echoes
    502, // City of Threads
    505, // The Dawnbreaker
    501, // The Stonevault
    375, // Mists of Tirna Scithe
    376, // The Necrotic Wake
    353, // Siege of Boralus
    507, // Grim Batol
];

const orderWarWithinS2: number[] = [
    506, // Cinderbrew Meadery
    504, // Darkflame Cleft
    525, // Operation: Floodgate
    499, // Priory of Sacred Flame
    500, // The Rookery
    382, // Theater of Pain [SL]
    247, // The MOTHERLODE!! [BfA]
    370, // Operation Mechagon: Workshop [BfA]
];

export const seasonMap: Record<number, MythicPlusSeason> = Object.fromEntries(
    [
        new MythicPlusSeason(
            14,
            '[TWW] Season 2',
            'war-within-2',
            80,
            [orderWarWithinS2],
            1001, // 2024-03-04
        ),
        new MythicPlusSeason(
            13,
            '[TWW] Season 1',
            'war-within-1',
            80,
            [orderWarWithinS1],
            977, // 2024-09-17
        ),
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
        new MythicPlusSeason(7, '[SL] Season 3', 'shadowlands-3', 60, [orderShadowlandsS3]),
        new MythicPlusSeason(6, '[SL] Season 2', 'shadowlands-2', 60, [orderShadowlands]),
        new MythicPlusSeason(5, '[SL] Season 1', 'shadowlands-1', 60, [orderShadowlands]),
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

export const weeklyAffixes: string[][] = [
    ['tyrannical', 'storming', 'raging'],
    ['fortified', 'entangling', 'bolstering'],
    ['tyrannical', 'incorporeal', 'spiteful'],
    ['fortified', 'afflicted', 'raging'],
    ['tyrannical', 'volcanic', 'sanguine'],
    ['fortified', 'storming', 'bursting'],
    ['tyrannical', 'afflicted', 'bolstering'],
    ['fortified', 'incorporeal', 'sanguine'],
    ['tyrannical', 'entangling', 'bursting'],
    ['fortified', 'volcanic', 'spiteful'],
];
