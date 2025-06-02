export interface GarrisonTree {
    id: number;
    direction: 'horizontal' | 'vertical';
    name: string;
    tiers: GarrisonTalent[][];
}

export interface GarrisonTalent {
    id: number;
    costs: number[];
    ranks: number;
    requires?: number;
}
