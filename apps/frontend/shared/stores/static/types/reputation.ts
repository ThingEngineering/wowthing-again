export class StaticDataReputation {
    constructor(
        public id: number,
        public expansion: number,
        public tierId: number,
        public parentId: number,
        public paragonId: number,
        public paragonQuestId: number,
        public paragonThreshold: number,
        public renownCurrencyId: number,
        public accountWide: boolean,
        public name: string,
        public baseValues: number[],
        public maxValues: number[]
    ) {}
}
export type StaticDataReputationArray = ConstructorParameters<typeof StaticDataReputation>;

export interface StaticDataReputationTier {
    id: number;
    minValues: number[];
    names: string[];
}
