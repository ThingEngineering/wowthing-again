import type { StatType } from '@/enums'


export class CharacterStatistics {
    public basic: Record<number, CharacterStatisticBasic> = {}
    public misc: Record<number, CharacterStatisticMisc> = {}
    public rating: Record<number, CharacterStatisticRating> = {}
}

export class CharacterStatisticBasic {
    constructor(
        public type: StatType,
        public base: number,
        public effective: number
    ) { }
}
export type CharacterStatisticBasicArray = ConstructorParameters<typeof CharacterStatisticBasic>

export class CharacterStatisticMisc {
    constructor(
        public type: StatType,
        public value: number
    ) { }
}
export type CharacterStatisticMiscArray = ConstructorParameters<typeof CharacterStatisticMisc>

export class CharacterStatisticRating {
    constructor(
        public type: StatType,
        public rating: number,
        public ratingBonus: number,
        public value?: number
    ) { }
}
export type CharacterStatisticRatingArray = ConstructorParameters<typeof CharacterStatisticRating>
