export interface CharacterPatronOrder {
    expirationTime: number;
    itemId: number;
    minQuality: number;
    skillLineAbilityId: number;
    tipAmount: number;
    reagents: {
        count: number;
        itemId: number;
    }[];
    rewards: {
        count: number;
        itemId: number;
    }[];
}
