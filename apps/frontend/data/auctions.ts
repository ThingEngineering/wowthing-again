export const timeLeft: Record<number, string> = {
    0: '< 30m',
    1: '30m - 2h',
    2: '2h - 12h',
    3: '12h - 48h',
};

export const extraCraftedItemIds: Set<number> = new Set<number>([
    // MoP cloth
    90472, // Windwool Belt
    90473, // Windwool Boots
    90474, // Windwool Bracers
    90475, // Windwool Pants
    90476, // Windwool Gloves
    90477, // Windwool Tunic
    90478, // Windwool Shoulders
    90479, // Windwool Hood

    // MoP leather
    90497, // Misthide Belt
    90496, // Misthide Boots
    90495, // Misthide Bracers
    90494, // Misthide Chestguard
    90493, // Misthide Gloves
    90492, // Misthide Helm
    90491, // Misthide Leggings
    90490, // Misthide Shoulders

    // MoP mail
    90480, // Stormscale Belt
    90481, // Stormscale Boots
    90482, // Stormscale Bracers
    90483, // Stormscale Chestguard
    90484, // Stormscale Gloves
    90485, // Stormscale Helm
    90486, // Stormscale Leggings
    90487, // Stormscale Shoulders

    // MoP plate
    82927, // Ghost-Forged Helm
    82928, // Ghost-Forged Shoulders
    82929, // Ghost-Forged Breastplate
    82930, // Ghost-Forged Gauntlets
    82931, // Ghost-Forged Legplates
    82932, // Ghost-Forged Bracers
    82933, // Ghost-Forged Boots
    82934, // Ghost-Forged Belt
]);

export const skipRecipeItemIds = new Set<number>([
    16072, // Expert Cookbook
    27736, // Master Cookbook
]);
