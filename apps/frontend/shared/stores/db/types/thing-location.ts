import { Faction } from '@/enums/faction';

export class DbDataThingLocation {
    public xCoordinate: string;
    public yCoordinate: string;
    public faction: Faction = Faction.Both;

    constructor(packedLocation: number) {
        if (packedLocation > 200_000_000) {
            this.faction = Faction.Horde;
        } else if (packedLocation > 100_000_000) {
            this.faction = Faction.Alliance;
        }

        // 12345678 => x: 12.34, y: 56.78
        this.xCoordinate = (Math.floor((packedLocation / 10000) % 10000) / 100).toFixed(2);
        this.yCoordinate = ((packedLocation % 10000) / 100).toFixed(2);
    }
}
