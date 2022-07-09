import type { ItemQuality } from "@/types/enums";

export class StaticDataBag {
    constructor(
        public id: number,
        public quality: ItemQuality,
        public slots: number
    )
    { }
}
export type StaticDataBagArray = ConstructorParameters<typeof StaticDataBag>
