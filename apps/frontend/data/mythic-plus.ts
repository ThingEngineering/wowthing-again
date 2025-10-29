import { MythicPlusScoreType } from '@/enums/mythic-plus-score-type';
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

const orderWarWithinS3: number[] = [
    503, // Ara-Kara, City of Echoes
    505, // The Dawnbreaker
    542, // Eco-Dome Al'dani
    525, // Operation: Floodgate
    499, // Priory of Sacred Flame
    378, // Halls of Atonement [SL]
    392, // Tazavesh: So'leah's Gambit [SL]
    391, // Tazavesh: Streets of Wonder [SL]
];

const orderRemixLegion: number[] = [
    209, // The Arcway
    199, // Black Rook Hold
    210, // Court of Stars
    198, // Darkheart Thicket
    197, // Eye of Azshara
    200, // Halls of Valor
    208, // Maw of Souls
    206, // Neltharion's Lair
    207, // Vault of the Wardens
    227, // Kara Lower
    234, // Kara Upper
    233, // Cathedral
    239, // Seat
];

export const seasonMap: Record<number, MythicPlusSeason> = Object.fromEntries(
    [
        new MythicPlusSeason({
            id: 1001,
            name: '[Legion] Remix',
            slug: 'remix-legion',
            minLevel: 80,
            orders: [orderRemixLegion],
            portalLevel: 20,
            scoreType: MythicPlusScoreType.WarWithin,
            startPeriod: 1030,
        }),
        new MythicPlusSeason({
            id: 15,
            name: '[TWW] Season 3',
            slug: 'war-within-3',
            minLevel: 80,
            orders: [orderWarWithinS3],
            portalLevel: 10,
            scoreType: MythicPlusScoreType.WarWithin,
            startPeriod: 1024, // 2025-08-12
        }),
        new MythicPlusSeason({
            id: 14,
            name: '[TWW] Season 2',
            slug: 'war-within-2',
            minLevel: 80,
            orders: [orderWarWithinS2],
            portalLevel: 10,
            scoreType: MythicPlusScoreType.WarWithin,
            startPeriod: 1001, // 2025-03-04
        }),
        new MythicPlusSeason({
            id: 13,
            name: '[TWW] Season 1',
            slug: 'war-within-1',
            minLevel: 80,
            orders: [orderWarWithinS1],
            portalLevel: 10,
            scoreType: MythicPlusScoreType.WarWithin,
            startPeriod: 977, // 2024-09-17
        }),
        new MythicPlusSeason({
            id: 12,
            name: '[DF] Season 4',
            slug: 'dragonflight-4',
            minLevel: 70,
            orders: [orderDragonflightS4],
            portalLevel: 20,
            scoreType: MythicPlusScoreType.FortifiedTyrannical,
            startPeriod: 956, // 2024-04-23
        }),
        new MythicPlusSeason({
            id: 11,
            name: '[DF] Season 3',
            slug: 'dragonflight-3',
            minLevel: 70,
            orders: [orderDragonflightS3],
            portalLevel: 20,
            scoreType: MythicPlusScoreType.FortifiedTyrannical,
            startPeriod: 933, // 2023-11-14
        }),
        new MythicPlusSeason({
            id: 10,
            name: '[DF] Season 2',
            slug: 'dragonflight-2',
            minLevel: 70,
            portalLevel: 20,
            orders: [orderDragonflightS2],
            scoreType: MythicPlusScoreType.FortifiedTyrannical,
            startPeriod: 906, // 2023-05-09
        }),
        new MythicPlusSeason({
            id: 9,
            name: '[DF] Season 1',
            slug: 'dragonflight-1',
            minLevel: 70,
            portalLevel: 20,
            orders: [orderDragonflightS1],
            scoreType: MythicPlusScoreType.FortifiedTyrannical,
            startPeriod: 885, // 2022-12-13
        }),
        new MythicPlusSeason({
            id: 8,
            name: '[SL] Season 4',
            slug: 'shadowlands-4',
            minLevel: 60,
            portalLevel: 20,
            orders: [orderShadowlandsS4],
            scoreType: MythicPlusScoreType.FortifiedTyrannical,
            startPeriod: 866, // 2022-08-02
        }),
        new MythicPlusSeason({
            id: 7,
            name: '[SL] Season 3',
            slug: 'shadowlands-3',
            minLevel: 60,
            portalLevel: 20,
            scoreType: MythicPlusScoreType.FortifiedTyrannical,
            orders: [orderShadowlandsS3],
        }),
        new MythicPlusSeason({
            id: 6,
            name: '[SL] Season 2',
            slug: 'shadowlands-2',
            minLevel: 60,
            portalLevel: 20,
            scoreType: MythicPlusScoreType.FortifiedTyrannical,
            orders: [orderShadowlands],
        }),
        new MythicPlusSeason({
            id: 5,
            name: '[SL] Season 1',
            slug: 'shadowlands-1',
            minLevel: 60,
            portalLevel: 20,
            orders: [orderShadowlands],
        }),
        new MythicPlusSeason({
            id: 4,
            name: '[BfA] Season 4',
            slug: 'battle-for-azeroth-4',
            minLevel: 50,
            portalLevel: 10,
            orders: [orderBattleForAzeroth, orderBattleForAzeroth2],
        }),
        new MythicPlusSeason({
            id: 3,
            name: '[BfA] Season 3',
            slug: 'battle-for-azeroth-3',
            minLevel: 50,
            portalLevel: 10,
            orders: [orderBattleForAzeroth],
        }),
        new MythicPlusSeason({
            id: 2,
            name: '[BfA] Season 2',
            slug: 'battle-for-azeroth-2',
            minLevel: 50,
            portalLevel: 10,
            orders: [orderBattleForAzeroth],
        }),
        new MythicPlusSeason({
            id: 1,
            name: '[BfA] Season 1',
            slug: 'battle-for-azeroth-1',
            minLevel: 50,
            portalLevel: 10,
            orders: [orderBattleForAzeroth],
        }),
    ].map((season) => [season.id, season])
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
