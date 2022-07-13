import type { ItemQuality } from "@/types/enums";


export class ManualDataSharedItem {
    constructor(
        public id: number,
        public quality: ItemQuality,
        public appearanceId: number,
        public name: string
    )
    { }
}

export type ManualDataSharedItemArray = ConstructorParameters<typeof ManualDataSharedItem>
