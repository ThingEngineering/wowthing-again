export type ConvertibleCategoryTier = {
    itemLevel: number;
    lowUpgrade?: ConvertibleCategoryUpgrade[];
    highUpgrade?: ConvertibleCategoryUpgrade[];
};

export type ConvertibleCategoryUpgrade = {
    upgradeId: number;
    upgradeCost: number;
    achievementId: number;
    achievementUpgradeCost: number;
};

export type ConvertibleCategory = {
    id: number;
    minimumLevel: number;
    name: string;
    slug: string;
    conversionCurrencyId?: number;
    tiers: ConvertibleCategoryTier[];
    purchases?: {
        costId: number;
        costAmount: Record<number, number>;
        upgradeTier: number;
        upgradeable?: boolean;
        progressKey?: string;
    }[];

    sourceTier?: number;
    sources?: Record<number, Record<number, number>>;
};
