import { Dungeon } from '@/types';
import type { StaticDataInstance } from '@/shared/stores/static/types';
import { convertibleCategories } from '@/components/items/convertible/data';

// MapChallengeMode.db2
export const dungeons: Dungeon[] = [
    // Wrath of the Lich King
    new Dungeon(556, 'Pit of Saron', 'PIT', '', 1860 / 60),

    // Cataclysm
    new Dungeon(438, 'The Vortex Pinnacle', 'VP', 'achievement/4847', 1800 / 60),
    new Dungeon(456, 'Throne of the Tides', 'ToT', 'achievement/4839', 2040 / 60),
    new Dungeon(507, 'Grim Batol', 'GB', 'achievement/4840', 30),
    new Dungeon(541, 'The Stonecore', 'SC', 'achievement/5063', 1800 / 60),

    // Mists of Pandaria
    new Dungeon(2, 'Temple of the Jade Serpent', 'TJS', 'achievement/6757', 30),

    // Warlords of Draenor
    new Dungeon(161, 'Skyreach', 'SR', 'achievement/8844', 1680 / 60),
    new Dungeon(165, 'Shadowmoon Burial Grounds', 'SBG', 'achievement/9041', 33),
    new Dungeon(166, 'Grimrail Depot', 'GD', 'achievement/9043', 30),
    new Dungeon(168, 'The Everbloom', 'EB', 'achievement/9044', 1980 / 60),
    new Dungeon(169, 'Iron Docks', 'ID', 'achievement/9038', 32),

    // Legion
    new Dungeon(197, 'Eye of Azshara', 'EoA', 'achievement/10782', 2100 / 60),
    new Dungeon(198, 'Darkheart Thicket', 'DHT', 'achievement/10783', 1800 / 60),
    new Dungeon(199, 'Black Rook Hold', 'BRH', 'achievement/10804', 2160 / 60),
    new Dungeon(200, 'Halls of Valor', 'HoV', 'achievement/10786', 38),
    new Dungeon(206, "Neltharion's Lair", 'NL', 'achievement/10795', 33),
    new Dungeon(207, 'Vault of the Wardens', 'VoW', 'achievement/10803', 1980 / 60),
    new Dungeon(208, 'Maw of Souls', 'MoS', 'achievement/10809', 1440 / 60),
    new Dungeon(209, 'The Arcway', 'Arc', 'achievement/10813', 2700 / 60),
    new Dungeon(210, 'Court of Stars', 'CoS', 'achievement/10816', 30),
    new Dungeon(
        227,
        'Return to Karazhan: Lower',
        'LOWR',
        'achievement/11338', // Dine and Dash
        42
    ),
    new Dungeon(233, 'Cathedral of Eternal Night', 'CEN', 'achievement/11702', 2100 / 60),
    new Dungeon(234, 'Return to Karazhan: Upper', 'UPPR', 'achievement/11429', 35),
    new Dungeon(239, 'Seat of the Triumvirate', 'SoT', 'achievement/12008', 2100 / 60),
    // ?? why is there a new one for Midnight
    new Dungeon(583, 'Seat of the Triumvirate', 'SoT', 'achievement/12008', 1200 / 60),

    // Battle for Azeroth
    new Dungeon(244, "Atal'Dazar", 'AD', 'achievement/12824', 1800 / 60),
    new Dungeon(245, 'Freehold', 'FH', 'achievement/12831', 1860 / 60),
    new Dungeon(246, 'Tol Dagor', 'TD', 'achievement/12840', 2160 / 60),
    new Dungeon(247, 'The MOTHERLODE!!', 'ML', 'achievement/12844', 2340 / 60),
    new Dungeon(248, 'Waycrest Manor', 'WM', 'achievement/12483', 2220 / 60),
    new Dungeon(249, "Kings' Rest", 'KR', 'achievement/12848', 2520 / 60),
    new Dungeon(250, 'Temple of Sethraliss', 'ToS', 'achievement/12504', 2160 / 60),
    new Dungeon(251, 'The Underrot', 'UR', 'achievement/12500', 1920 / 60),
    new Dungeon(252, 'Shrine of the Storm', 'SoS', 'achievement/12835', 2520 / 60),
    new Dungeon(353, 'Siege of Boralus', 'SIEGE', 'achievement/12847', 2160 / 60),
    new Dungeon(369, 'Operation: Mechagon - Junkyard', 'YARD', 'achievement/15693', 2280 / 60),
    new Dungeon(370, 'Operation: Mechagon - Workshop', 'WORK', 'achievement/15693', 1920 / 60),

    // Shadowlands
    new Dungeon(375, 'Mists of Tirna Scithe', 'MISTS', 'dungeon_mists_of_tirna_scithe', 30),
    new Dungeon(376, 'The Necrotic Wake', 'NW', 'dungeon_the_necrotic_wake', 36),
    new Dungeon(377, 'De Other Side', 'DOS', 'dungeon_de_other_side', 43),
    new Dungeon(378, 'Halls of Atonement', 'HoA', 'dungeon_halls_of_atonement', 31),
    new Dungeon(379, 'Plaguefall', 'PF', 'dungeon_plaguefall', 38),
    new Dungeon(380, 'Sanguine Depths', 'SD', 'dungeon_sanguine_depths', 41),
    new Dungeon(381, 'Spires of Ascension', 'SoA', 'dungeon_spires_of_ascension', 39),
    new Dungeon(382, 'Theater of Pain', 'ToP', 'dungeon_theater_of_pain', 37),
    new Dungeon(
        391,
        'Tazavesh: Streets of Wonder',
        'STRT',
        'achievement/15106', // Quality Control
        39
    ),
    new Dungeon(392, "Tazavesh: So'leah's Gambit", 'GMBT', 'achievement/15177', 30),

    // Dragonflight
    new Dungeon(399, 'Ruby Life Pools', 'RLP', 'achievement/16266', 30),
    new Dungeon(400, 'The Nokhud Offensive', 'NO', 'achievement/16277', 40),
    new Dungeon(401, 'The Azure Vaults', 'AV', 'achievement/16272', 35.5),
    new Dungeon(402, "Algeth'ar Academy", 'AA', 'achievement/16271', 32),
    new Dungeon(403, 'Uldaman: Legacy of Tyr', 'ULD', 'achievement/16278', 2280 / 60),
    new Dungeon(404, 'Neltharus', 'NELT', 'achievement/16263', 1980 / 60),
    new Dungeon(405, 'Brackenhide Hollow', 'BH', 'achievement/16255', 2100 / 60),
    new Dungeon(406, 'Halls of Infusion', 'HOI', 'achievement/16260', 2100 / 60),
    new Dungeon(
        463,
        "Dawn of the Infinite: Galakrond's Fall",
        'FALL',
        'achievement/18703',
        2100 / 60
    ),
    new Dungeon(
        464,
        "Dawn of the Infinite: Murozond's Rise",
        'RISE',
        'achievement/6150',
        2280 / 60
    ),

    // The War Within
    new Dungeon(499, 'Priory of the Sacred Flame', 'PSF', 'achievement/40596', 30),
    new Dungeon(500, 'The Rookery', 'TR', 'achievement/40642', 30),
    new Dungeon(501, 'The Stonevault', 'SV', 'achievement/40648', 30),
    new Dungeon(502, 'City of Threads', 'CoT', 'achievement/40379', 30),
    new Dungeon(503, 'Ara-Kara, City of Echoes', 'ARAK', 'achievement/40375', 30),
    new Dungeon(504, 'Darkflame Cleft', 'DC', 'achievement/40429', 30),
    new Dungeon(505, 'The Dawnbreaker', 'DAWN', 'achievement/40604', 30),
    new Dungeon(506, 'Cinderbrew Meadery', 'CM', 'achievement/40366', 30),
    new Dungeon(525, 'Operation: Floodgate', 'OF', 'achievement/41339', 1920 / 60),
    new Dungeon(542, "Eco-Dome Al'dani", 'EDA', 'achievement/42782', 1860 / 60),

    // Midnight
    new Dungeon(557, 'Windrunner Spire', 'WS', 'achievement/41288', 2010 / 60),
    new Dungeon(558, "Magister's Terrace", 'MT', 'achievement/61213', 2010 / 60),
    new Dungeon(559, 'Nexus-Point Xenas', 'NPX', 'achievement/61646', 1770 / 60),
    new Dungeon(560, 'Maisara Caverns', 'MC', 'achievement/61644', 1980 / 60),
];

export const dungeonMap: Record<number, Dungeon> = Object.fromEntries(
    dungeons.map((dungeon) => [dungeon.id, dungeon])
);

// [key level, item level] first match >= key is used
export const keyVaultItemLevel: Array<Array<number>> = [
    [10, 147, 5], // Myth 1
    [7, 144, 4], // Hero 4
    [6, 141, 4], // Hero 3
    [4, 137, 4], // Hero 2
    [2, 134, 4], // Hero 1
    [1, 131, 3], // [0] Champion 4
    [0, 118, 2], // [H] Veteran 4
];

export const raidVaultItemLevel: Record<number, Array<number>> = {
    16: [convertibleCategories[0].tiers[0].itemLevel, 5], // Mythic
    15: [convertibleCategories[0].tiers[1].itemLevel, 4], // Heroic
    14: [convertibleCategories[0].tiers[2].itemLevel, 3], // Normal
    17: [convertibleCategories[0].tiers[3].itemLevel, 2], // LFR
};

export const worldVaultItemLevel: Array<Array<number>> = [
    [8, 134, 4], // Hero 1
    [7, 131, 3], // Champion 4
    [6, 128, 3], // Champion 3?
    [5, 121, 3], // Champion 1
    [4, 118, 2], // Veteran 4
    [3, 115, 2], // Veteran 3
    [2, 111, 2], // Veteran 2
    [1, 108, 2], // Veteran 1
];

export const keyTiers = ['2-5', '6-10', '11-15', '16-20', '21-25', '26-30', '31+'];

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
        name: "Mor'geth, Tormentor of the Damned",
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

    // The War Within
    {
        expansion: 10,
        id: 110001,
        name: 'War Within World Bosses',
        shortName: 'WWWB',
    },
    {
        expansion: 10,
        id: 110002,
        name: 'The Gobfather',
        shortName: 'Gob',
    },

    // Midnight
    {
        expansion: 11,
        id: 111001,
        name: 'Midnight World Bosses',
        shortName: 'MWB',
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
        id: 100004,
        name: 'Doomwalker',
        shortName: 'DW',
    },
    {
        expansion: 100,
        id: 100005,
        name: 'Archavon the Stone Watcher',
        shortName: 'Arch',
    },
    {
        expansion: 100,
        id: 100006,
        name: 'Sha of Anger',
        shortName: 'Sha',
    },
];

export const extraInstanceMap: Record<number, StaticDataInstance> = Object.fromEntries(
    extraInstances.map((instance) => [instance.id, instance])
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
    1278, // Khaz Algar
    1312, // Midnight
];

export const ignoredLockoutInstances: Record<number, boolean> = Object.fromEntries(
    [
        1192, // Shadowlands
        1205, // Dragon Isles
        1278, // Khaz Algar
        1312, // Midnight
    ].map((id) => [id, true])
);
