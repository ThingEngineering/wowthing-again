import { ItemQuality } from '@/enums/item-quality'


export class AppearanceDataAppearance {
    public modifiedAppearances: AppearanceDataModifiedAppearance[]

    constructor(
        public appearanceId: number,
        modifiedAppearanceArrays: AppearanceDataModifiedAppearanceArray[]
    )
    {
        this.modifiedAppearances = modifiedAppearanceArrays.map((maArray) => new AppearanceDataModifiedAppearance(...maArray))
    }
}
export type AppearanceDataAppearanceArray = ConstructorParameters<typeof AppearanceDataAppearance>

export class AppearanceDataModifiedAppearance {
    constructor(
        public itemId: number,
        public quality: ItemQuality,
        public modifier: number
    )
    {}
}
export type AppearanceDataModifiedAppearanceArray = ConstructorParameters<typeof AppearanceDataModifiedAppearance>
