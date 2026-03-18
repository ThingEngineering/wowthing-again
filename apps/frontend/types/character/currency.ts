export class CharacterCurrency {
    public isMovingMax: boolean;
    public isWeekly: boolean;
    public max: number;
    public quantity: number;
    public totalQuantity: number;
    public weekMax: number;
    public weekQuantity: number;

    public remainingTime: number = 0;

    constructor(
        public id: number,
        quantity?: number,
        max?: number,
        totalQuantity?: number,
        isMovingMax?: number,
        isWeekly?: number,
        weekQuantity?: number,
        weekMax?: number
    ) {
        this.isMovingMax = isMovingMax === 1;
        this.isWeekly = isWeekly === 1;
        this.max = max || 0;
        this.quantity = quantity || 0;
        this.totalQuantity = totalQuantity || 0;
        this.weekMax = weekMax || 0;
        this.weekQuantity = weekQuantity || 0;
    }

    public clone() {
        return new CharacterCurrency(
            this.id,
            this.quantity,
            this.max,
            this.totalQuantity,
            this.isMovingMax ? 1 : 0,
            this.isWeekly ? 1 : 0,
            this.weekQuantity,
            this.weekMax
        );
    }
}

export type CharacterCurrencyArray = ConstructorParameters<typeof CharacterCurrency>;
