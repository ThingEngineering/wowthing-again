export enum ItemQuality {
    Poor = 0,
    Common = 1,
    Uncommon = 2,
    Rare = 3,
    Epic = 4,
    Legendary = 5,
    Artifact = 6,
    Heirloom = 7,
    Token = 8,
}

export const itemQualities = Object.values(ItemQuality).filter(
    (value) => typeof value === 'number' && value !== ItemQuality.Token
);
