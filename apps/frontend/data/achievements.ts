export const addonAchievements: Record<number, boolean> = Object.fromEntries(
    [
        14765, // Ramparts Racer
        14766, // Parasoling
    ].map((id) => [id, true]),
);

export const forceAddonCriteria: Record<number, number> = {
    9450: 9452, // The Trap Game -> Trap Superstar
    9565: 9452, // Master Trapper -> Trap Superstar
    9451: 9452, // Trapper's Delight -> Trap Superstar
    9452: 9452, // Trap Superstar -> Trap Superstar
};

export const forceSupersededBy: Record<number, number> = {
    9: 14782, // Level 40 -> Level 50
    5324: 5325, // In Service of the Horde -> Veteran of the Horde
    5327: 5328, // In Service of the Alliance -> Veteran of the Alliance
    13701: 13702, // Battlefield Brawler -> Battlefield Tactician
    13702: 13703, // Battlefield Tactician -> Battlefield Master
};

export const forceGarrisonTalent: Record<number, [number, number]> = {
    91802: [1863, 2], // Elite Slayer Rank 2
    91803: [1783, 3], // Blessing Rank 3
    91804: [1787, 2], // Emp. Swiftness Rank 2
    91805: [1794, 1], // Efficent Looter
    91806: [1784, 2], // Freed from torment Rank 2
    91807: [1785, 3], // Emp Perservance Rank 3
    91808: [1792, 3], // Discovered Cache Rank 3
    91809: [1793, 5], // Undeterred Rank 5
    91810: [1788, 1], // Adamant Vaults
    91811: [1786, 5], // Inexplicable Power Rank 5
    91812: [1789, 1], // Enduring Souls
    91813: [1790, 2], // Good Reflexes Rank 2
    91814: [1791, 3], // Death Denied Rank 3
    91815: [1861, 5], // Unfllinching Rank 5
    91816: [1865, 3], // Anima Plunder Rank 3
    91817: [1864, 3], // Meddle with Fate 3
    91818: [1878, 1], // Empowered Mastery
};

export const forceSupersedes: Record<number, number> = Object.fromEntries(
    Object.entries(forceSupersededBy).map(([dest, src]) => [src, parseInt(dest)]),
);

export const honorAchievements: Record<number, boolean> = Object.fromEntries(
    [
        12893, // Honor Level 5
        12894, // Honor Level 10
        12895, // Honor Level 15
        12900, // Honor Level 20
        12901, // Honor Level 25
        12902, // Honor Level 30
        12903, // Honor Level 40
        12904, // Honor Level 50
        12905, // Honor Level 60
        12906, // Honor Level 70
        12907, // Honor Level 80
        12908, // Honor Level 90
        12909, // Honor Level 100
        12910, // Honor Level 125
        12911, // Honor Level 150
        12912, // Honor Level 175
        12913, // Honor Level 200
        12914, // Honor Level 250
        12915, // Honor Level 300
        12916, // Honor Level 400
        12917, // Honor Level 500
    ].map((id) => [id, true]),
);

export const extraCategories: [string, [string, number, string?, string?][]][] = [
    [
        'classic',
        [
            [
                'exploration/eastern-kingdoms',
                3,
                'exploration-eastern-kingdoms',
                'Exploration > Eastern Kingdoms',
            ],
            ['exploration/kalimdor', 3, 'exploration-kalimdor', 'Exploration > Kalimdor'],
            ['quests/eastern-kingdoms', 3, 'quests-eastern-kingdoms', 'Quests > Eastern Kingdoms'],
            ['quests/kalimdor', 3, 'quests-kalimdor', 'Quests > Kalimdor'],
            ['reputation/classic', 1],
            null,
            ['dungeons-raids/classic', 3, 'dungeons-raids', 'Dungeons & Raids'],
        ],
    ],
    [
        'the-burning-crusade',
        [
            ['exploration/outland', 1],
            ['quests/outland', 1],
            ['reputation/the-burning-crusade', 1],
            null,
            ['dungeons-raids/the-burning-crusade', 3, 'dungeons-raids', 'Dungeons & Raids'],
        ],
    ],
    [
        'wrath-of-the-lich-king',
        [
            ['exploration/northrend', 1],
            ['quests/northrend', 1],
            ['reputation/wrath-of-the-lich-king', 1],
            null,
            ['dungeons-raids/lich-king-dungeon', 3, 'dungeons', 'Dungeons'],
            ['dungeons-raids/lich-king-raid', 3, 'raids', 'Raids'],
            null,
            ['expansion-features/argent-tournament', 2],
        ],
    ],
    [
        'cataclysm',
        [
            ['exploration/cataclysm', 1],
            ['quests/cataclysm', 1],
            ['reputation/cataclysm', 1],
            null,
            ['dungeons-raids/cataclysm-dungeon', 3, 'dungeons', 'Dungeons'],
            ['dungeons-raids/cataclysm-raid', 3, 'raids', 'Raids'],
            null,
            ['expansion-features/tol-barad', 2],
        ],
    ],
    [
        'pandaria',
        [
            ['exploration/pandaria', 1],
            ['quests/pandaria', 1],
            ['reputation/pandaria', 1],
            null,
            ['dungeons-raids/pandaria-dungeon', 3, 'dungeons', 'Dungeons'],
            ['dungeons-raids/pandaria-raid', 3, 'raids', 'Raids'],
            null,
            ['expansion-features/proving-grounds', 2],
            ['expansion-features/pandaria-scenarios', 3, 'scenarios', 'Scenarios'],
        ],
    ],
    [
        'draenor',
        [
            ['exploration/draenor', 1],
            ['quests/draenor', 1],
            ['reputation/draenor', 1],
            null,
            ['dungeons-raids/draenor-dungeon', 3, 'dungeons', 'Dungeons'],
            ['dungeons-raids/draenor-raid', 3, 'raids', 'Raids'],
            null,
            ['expansion-features/draenor-garrison', 3, 'garrison', 'Garrison'],
        ],
    ],
    [
        'legion',
        [
            ['exploration/legion', 1],
            ['quests/legion', 1],
            ['reputation/legion', 1],
            null,
            ['dungeons-raids/legion-dungeon', 3, 'dungeons', 'Dungeons'],
            ['dungeons-raids/legion-raid', 3, 'raids', 'Raids'],
            null,
            ['expansion-features/legion-class-hall', 3, 'class-hall', 'Class Hall'],
        ],
    ],
    [
        'battle-for-azeroth',
        [
            ['exploration/battle-for-azeroth', 1],
            ['quests/battle-for-azeroth', 1],
            ['reputation/battle-for-azeroth', 1],
            null,
            ['dungeons-raids/battle-dungeon', 3, 'dungeons', 'Dungeons'],
            ['dungeons-raids/battle-raid', 3, 'raids', 'Raids'],
            null,
            ['expansion-features/heart-of-azeroth', 2],
            ['expansion-features/island-expeditions', 2],
            ['expansion-features/visions-of-nzoth', 2],
            ['expansion-features/war-effort', 2],
        ],
    ],
    [
        'shadowlands',
        [
            ['exploration/shadowlands', 1],
            ['quests/shadowlands', 1],
            ['reputation/shadowlands', 1],
            null,
            ['dungeons-raids/shadowlands-dungeon', 3, 'dungeons', 'Dungeons'],
            ['dungeons-raids/shadowlands-raid', 3, 'raids', 'Raids'],
            null,
            ['expansion-features/covenant-sanctums', 2],
            ['expansion-features/torghast', 2],
        ],
    ],
    [
        'dragonflight',
        [
            ['exploration/dragonflight', 1], // 10.x
            ['exploration/dragon-isles', 1], // 11.x
            ['quests/dragonflight', 1],
            ['reputation/dragonflight', 1],
            null,
            ['dungeons-raids/dragonflight-dungeon', 3, 'dungeons', 'Dungeons'],
            ['dungeons-raids/dragonflight-raid', 3, 'raids', 'Raids'],
            null,
            ['expansion-features/dragonriding', 2], // 10.x
            ['expansion-features/skyriding', 2], // 11.x
            ['collections/dragon-isle-drake-cosmetics', 2],
        ],
    ],
    [
        'war-within',
        [
            ['exploration/war-within', 1],
            ['quests/war-within', 1],
            ['reputation/war-within', 1],
            null,
            ['dungeons-raids/war-within-dungeon', 3, 'dungeons', 'Dungeons'],
            ['dungeons-raids/war-within-raid', 3, 'raids', 'Raids'],
            null,
            ['delves/the-war-within', 1],
        ],
    ],
];
