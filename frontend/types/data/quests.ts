import { Faction, ItemQuality } from "../enums";

export class GlobalDailyQuest {
    constructor(
        public id: number,
        public quality: ItemQuality,
        public allianceName: string,
        public hordeName: string,
        public description: string,
    )
    {}

    getName(faction: Faction): string {
        return faction === Faction.Horde && this.hordeName ? this.hordeName : this.allianceName
    }
}
