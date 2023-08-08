export class DataItemBonus {
    constructor(
        public id: number,
        public typeFlags: number,
        public bonuses: number[][]
    ) { }
}
export type DataItemBonusArray = ConstructorParameters<typeof DataItemBonus>
