export const addonAchievements: Record<number, boolean> = Object.fromEntries(
    [
        14765, // Ramparts Racer
        14766, // Parasoling
    ].map((id) => [id, true])
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

export const forceShowCriteriaTree: Set<number> = new Set<number>([
    80091, // Waveblade Ankoan
]);

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
    Object.entries(forceSupersededBy).map(([dest, src]) => [src, parseInt(dest)])
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
    ].map((id) => [id, true])
);

type ExtraAchievementCategory = {
    slug: string;
    achievementIds?: number[];
    children: {
        // 1 = target category, 2 = parent category, 3 = custom
        nameType: number;
        targetSlug: string;

        achievementIds?: (number | number[])[];
        overrideName?: string;
        overrideSlug?: string;
    }[];
};
export const extraCategories: ExtraAchievementCategory[] = [
    {
        slug: 'classic',
        children: [
            {
                targetSlug: 'exploration/eastern-kingdoms',
                nameType: 3,
                overrideName: 'Exploration > Eastern Kingdoms',
                overrideSlug: 'exploration-eastern-kingdoms',
            },
            {
                targetSlug: 'exploration/kalimdor',
                nameType: 3,
                overrideName: 'Exploration > Kalimdor',
                overrideSlug: 'exploration-kalimdor',
            },
            {
                targetSlug: 'quests/eastern-kingdoms',
                nameType: 3,
                overrideName: 'Quests > Eastern Kingdoms',
                overrideSlug: 'quests-eastern-kingdoms',
            },
            {
                targetSlug: 'quests/kalimdor',
                nameType: 3,
                overrideName: 'Quests > Kalimdor',
                overrideSlug: 'quests-kalimdor',
            },
            { targetSlug: 'reputation/classic', nameType: 1 },
            null,
            {
                targetSlug: 'dungeons-raids/classic',
                nameType: 3,
                overrideName: 'Dungeons & Raids',
                overrideSlug: 'dungeons-raids',
            },
        ],
    },
    {
        slug: 'the-burning-crusade',
        children: [
            { targetSlug: 'exploration/outland', nameType: 1 },
            { targetSlug: 'quests/outland', nameType: 1 },
            { targetSlug: 'reputation/the-burning-crusade', nameType: 1 },
            null,
            {
                targetSlug: 'dungeons-raids/the-burning-crusade',
                nameType: 3,
                overrideName: 'Dungeons & Raids',
                overrideSlug: 'dungeons-raids',
            },
        ],
    },
    {
        slug: 'wrath-of-the-lich-king',
        children: [
            { targetSlug: 'exploration/northrend', nameType: 1 },
            { targetSlug: 'quests/northrend', nameType: 1 },
            { targetSlug: 'reputation/wrath-of-the-lich-king', nameType: 1 },
            null,
            {
                targetSlug: 'dungeons-raids/lich-king-dungeon',
                nameType: 3,
                overrideName: 'Dungeons',
                overrideSlug: 'dungeons',
            },
            {
                targetSlug: 'dungeons-raids/lich-king-raid',
                nameType: 3,
                overrideName: 'Raids',
                overrideSlug: 'raids',
            },
            null,
            { targetSlug: 'expansion-features/argent-tournament', nameType: 2 },
        ],
    },
    {
        slug: 'cataclysm',
        children: [
            { targetSlug: 'exploration/cataclysm', nameType: 1 },
            { targetSlug: 'quests/cataclysm', nameType: 1 },
            { targetSlug: 'reputation/cataclysm', nameType: 1 },
            null,
            {
                targetSlug: 'dungeons-raids/cataclysm-dungeon',
                nameType: 3,
                overrideName: 'Dungeons',
                overrideSlug: 'dungeons',
            },
            {
                targetSlug: 'dungeons-raids/cataclysm-raid',
                nameType: 3,
                overrideName: 'Raids',
                overrideSlug: 'raids',
            },
            null,
            { targetSlug: 'expansion-features/tol-barad', nameType: 2 },
        ],
    },
    {
        slug: 'pandaria',
        children: [
            { targetSlug: 'exploration/pandaria', nameType: 1 },
            { targetSlug: 'quests/pandaria', nameType: 1 },
            { targetSlug: 'reputation/pandaria', nameType: 1 },
            null,
            {
                targetSlug: 'dungeons-raids/pandaria-dungeon',
                nameType: 3,
                overrideName: 'Dungeons',
                overrideSlug: 'dungeons',
            },
            {
                targetSlug: 'dungeons-raids/pandaria-raid',
                nameType: 3,
                overrideName: 'Raids',
                overrideSlug: 'raids',
            },
            null,
            { targetSlug: 'expansion-features/proving-grounds', nameType: 2 },
            {
                targetSlug: 'expansion-features/pandaria-scenarios',
                nameType: 3,
                overrideName: 'Scenarios',
                overrideSlug: 'scenarios',
            },
        ],
    },
    {
        slug: 'draenor',
        children: [
            { targetSlug: 'exploration/draenor', nameType: 1 },
            { targetSlug: 'quests/draenor', nameType: 1 },
            { targetSlug: 'reputation/draenor', nameType: 1 },
            null,
            {
                targetSlug: 'dungeons-raids/draenor-dungeon',
                nameType: 3,
                overrideName: 'Dungeons',
                overrideSlug: 'dungeons',
            },
            {
                targetSlug: 'dungeons-raids/draenor-raid',
                nameType: 3,
                overrideName: 'Raids',
                overrideSlug: 'raids',
            },
            null,
            {
                targetSlug: 'expansion-features/draenor-garrison',
                nameType: 3,
                overrideName: 'Garrison',
                overrideSlug: 'garrison',
            },
        ],
    },
    {
        slug: 'legion',
        children: [
            { targetSlug: 'exploration/legion', nameType: 1 },
            { targetSlug: 'quests/legion', nameType: 1 },
            { targetSlug: 'reputation/legion', nameType: 1 },
            null,
            {
                targetSlug: 'dungeons-raids/legion-dungeon',
                nameType: 3,
                overrideName: 'Dungeons',
                overrideSlug: 'dungeons',
            },
            {
                targetSlug: 'dungeons-raids/legion-raid',
                nameType: 3,
                overrideName: 'Raids',
                overrideSlug: 'raids',
            },
            null,
            {
                targetSlug: 'expansion-features/legion-class-hall',
                nameType: 3,
                overrideName: 'Class Hall',
                overrideSlug: 'class-hall',
            },
        ],
    },
    {
        slug: 'battle-for-azeroth',
        children: [
            { targetSlug: 'exploration/battle-for-azeroth', nameType: 1 },
            { targetSlug: 'quests/battle-for-azeroth', nameType: 1 },
            { targetSlug: 'reputation/battle-for-azeroth', nameType: 1 },
            null,
            {
                targetSlug: 'dungeons-raids/battle-dungeon',
                nameType: 3,
                overrideName: 'Dungeons',
                overrideSlug: 'dungeons',
            },
            {
                targetSlug: 'dungeons-raids/battle-raid',
                nameType: 3,
                overrideName: 'Raids',
                overrideSlug: 'raids',
            },
            null,
            { targetSlug: 'expansion-features/heart-of-azeroth', nameType: 2 },
            { targetSlug: 'expansion-features/island-expeditions', nameType: 2 },
            { targetSlug: 'expansion-features/visions-of-nzoth', nameType: 2 },
            { targetSlug: 'expansion-features/war-effort', nameType: 2 },
        ],
    },
    {
        slug: 'shadowlands',
        children: [
            { targetSlug: 'exploration/shadowlands', nameType: 1 },
            { targetSlug: 'quests/shadowlands', nameType: 1 },
            { targetSlug: 'reputation/shadowlands', nameType: 1 },
            null,
            {
                targetSlug: 'dungeons-raids/shadowlands-dungeon',
                nameType: 3,
                overrideName: 'Dungeons',
                overrideSlug: 'dungeons',
            },
            {
                targetSlug: 'dungeons-raids/shadowlands-raid',
                nameType: 3,
                overrideName: 'Raids',
                overrideSlug: 'raids',
            },
            null,
            { targetSlug: 'expansion-features/covenant-sanctums', nameType: 2 },
            { targetSlug: 'expansion-features/torghast', nameType: 2 },
        ],
    },
    {
        slug: 'dragonflight',
        children: [
            {
                targetSlug: 'exploration/dragon-isles',
                nameType: 1,
                achievementIds: [
                    16761, // Dragon Isles Explorer
                ],
            },
            { targetSlug: 'quests/dragonflight', nameType: 1 },
            { targetSlug: 'reputation/dragonflight', nameType: 1 },
            null,
            {
                targetSlug: 'dungeons-raids/dragonflight-dungeon',
                nameType: 3,
                overrideName: 'Dungeons',
                overrideSlug: 'dungeons',
                achievementIds: [
                    16294, // Dragonflight Dungeon Hero
                    16295, // Glory of the Dragonflight Hero
                ],
            },
            {
                targetSlug: 'dungeons-raids/dragonflight-raid',
                nameType: 3,
                overrideName: 'Raids',
                overrideSlug: 'raids',
                achievementIds: [
                    16355, // Glory of the Vault Raider
                    18251, // Glory of the Aberrus Raider
                    19349, // Glory of the Dream Raider
                ],
            },
            null,
            { targetSlug: 'expansion-features/skyriding', nameType: 2 },
            {
                targetSlug: 'collections/dragon-isle-drake-cosmetics',
                nameType: 3,
                overrideName: 'Drake Cosmetics',
                overrideSlug: 'drake-cosmetics',
            },
        ],
    },
    {
        slug: 'war-within',
        children: [
            { targetSlug: 'exploration/war-within', nameType: 1 },
            { targetSlug: 'quests/war-within', nameType: 1 },
            { targetSlug: 'reputation/war-within', nameType: 1 },
            null,
            {
                targetSlug: 'delves/the-war-within',
                nameType: 1,
                achievementIds: [
                    40438, // Glory of the Delver
                    40537, // Delve Loremaster: War Within
                    40437, // Delver of the Depths 1
                    40447, // Delver of the Depths 2
                    40448, // Delver of the Depths 3
                    40449, // Delver of the Depths 4
                ],
            },
            {
                targetSlug: 'dungeons-raids/war-within-dungeon',
                nameType: 3,
                overrideName: 'Dungeons',
                overrideSlug: 'dungeons',
            },
            {
                targetSlug: 'dungeons-raids/war-within-raid',
                nameType: 3,
                overrideName: 'Raids',
                overrideSlug: 'raids',
                achievementIds: [
                    40232, // Glory of the Nerub-ar Raider
                    41286, // Glory of the Liberation of Undermine Raider
                    41597, // Glory of the Omega Raider
                ],
            },
        ],
    },
    {
        slug: 'midnight',
        children: [
            { targetSlug: 'exploration/midnight', nameType: 1 },
            { targetSlug: 'quests/midnight', nameType: 1 },
            { targetSlug: 'reputation/midnight', nameType: 1 },
            null,
            {
                targetSlug: 'delves/midnight',
                nameType: 1,
                achievementIds: [],
            },
            {
                targetSlug: 'dungeons-raids/midnight-dungeon',
                nameType: 3,
                overrideName: 'Dungeons',
                overrideSlug: 'dungeons',
                achievementIds: [61567, 61568],
            },
            {
                targetSlug: 'dungeons-raids/midnight-raid',
                nameType: 3,
                overrideName: 'Raids',
                overrideSlug: 'raids',
                achievementIds: [
                    61380, // Glory of the Midnight Raider
                ],
            },
            null,
            { targetSlug: 'expansion-features/prey', nameType: 2 },
        ],
    },
];
