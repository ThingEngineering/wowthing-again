export type ConvertibleCategoryTier = {
    itemLevel: number;
    lowUpgrade?: [number, number, number?][];
    highUpgrade?: [number, number, number?][];
    achievementId?: number;
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
