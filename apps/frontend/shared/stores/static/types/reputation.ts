export class StaticDataReputation {
    constructor(
        public id: number,
        public expansion: number,
        public tierId: number,
        public parentId: number,
        public paragonId: number,
        public renownCurrencyId: number,
        public accountWide: boolean,
        public name: string,
        public description?: string,
    ) {}
}
export type StaticDataReputationArray = ConstructorParameters<typeof StaticDataReputation>;

export interface StaticDataReputationTier {
    id: number;
    minValues: number[];
    names: string[];
}
