import type { Character } from './character';

export interface TeamData {
    defaultRealmId: number;
    description: string;
    name: string;
    region: number;

    characters: TeamDataCharacter[];
}

export interface TeamDataCharacter {
    character: Character;
    note: string;
}
