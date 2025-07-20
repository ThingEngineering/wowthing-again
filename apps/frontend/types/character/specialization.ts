export interface CharacterSpecializationRaw {
    loadouts: CharacterSpecializationLoadoutRaw[];
}

export interface CharacterSpecializationLoadoutRaw {
    active: boolean;
    heroTreeId: number;
    loadoutCode: string;
    talents: [number, number, number][];
}

export class CharacterSpecializationLoadout {
    public active: boolean;
    public heroTreeId: number;
    public loadoutCode: string;
    public talents: Record<number, [number, number]>;

    constructor(rawLoadout: CharacterSpecializationLoadoutRaw) {
        this.active = rawLoadout.active;
        this.heroTreeId = rawLoadout.heroTreeId;
        this.loadoutCode = rawLoadout.loadoutCode;

        this.talents = {};
        for (const [nodeId, rank, spellId] of rawLoadout.talents) {
            this.talents[nodeId] = [rank, spellId];
        }
    }
}
