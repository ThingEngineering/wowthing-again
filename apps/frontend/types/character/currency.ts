export class CharacterCurrency {
    public isWeekly: boolean
    public isMovingMax: boolean
    
    constructor(
        public quantity: number,
        public max: number,
        public weekQuantity: number,
        public weekMax: number,
        public totalQuantity: number,
        public id: number,
        isWeekly: number,
        isMovingMax: number
    )
    {
        this.isWeekly = isWeekly === 1
        this.isMovingMax = isMovingMax === 1
    }
}

export type CharacterCurrencyArray = ConstructorParameters<typeof CharacterCurrency>
