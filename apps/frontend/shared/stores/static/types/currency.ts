export class StaticDataCurrency {
    constructor(
        public id: number,
        public categoryId: number,
        public maxPerWeek: number,
        public maxTotal: number,
        public name: string
    )
    { }
}
export type StaticDataCurrencyArray = ConstructorParameters<typeof StaticDataCurrency>

export class StaticDataCurrencyCategory {
    constructor(
        public id: number,
        public name: string,
        public slug: string
    )
    { }
}

export type StaticDataCurrencyCategoryArray = ConstructorParameters<typeof StaticDataCurrencyCategory>
