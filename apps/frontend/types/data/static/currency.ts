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

export interface StaticDataCurrencyCategory {
    id: number
    name: string
    slug: string
}
