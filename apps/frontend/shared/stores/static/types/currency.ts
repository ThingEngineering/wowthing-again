import { CurrencyFlags } from '@/enums/currency-flags';

export class StaticDataCurrency {
    constructor(
        public id: number,
        public categoryId: number,
        public flags: CurrencyFlags,
        public maxPerWeek: number,
        public maxTotal: number,
        public rechargeAmount: number,
        public rechargeInterval: number,
        public transferPercent: number,
        public name: string,
        public description: string
    ) {}

    get imageName(): string {
        return `currency/${this.id}`;
    }
    get isAccountWide(): boolean {
        return (this.flags & CurrencyFlags.AccountWide) > 0;
    }
    get isAllianceOnly(): boolean {
        return (this.flags & CurrencyFlags.AllianceOnly) > 0;
    }
    get isHordeOnly(): boolean {
        return (this.flags & CurrencyFlags.HordeOnly) > 0;
    }
    get isScaledBy100(): boolean {
        return (this.flags & CurrencyFlags.ScaledBy100) > 0;
    }
    get isTradable(): boolean {
        return (this.flags & CurrencyFlags.Tradable) > 0;
    }
    get isTransferable(): boolean {
        return this.transferPercent > 0;
    }
}
export type StaticDataCurrencyArray = ConstructorParameters<typeof StaticDataCurrency>;

export class StaticDataCurrencyCategory {
    constructor(
        public id: number,
        public name: string,
        public slug: string
    ) {}
}

export type StaticDataCurrencyCategoryArray = ConstructorParameters<
    typeof StaticDataCurrencyCategory
>;
