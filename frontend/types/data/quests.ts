import type { ItemQuality } from "../enums";

export class GlobalDailyQuest {
    constructor(
        public id: number,
        public quality: ItemQuality,
        public name: string,
        public description: string,
    )
    {}
}
