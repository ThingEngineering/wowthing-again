import type { RewardType } from '@/enums/reward-type';

export interface FarmStatus {
    characters: CharacterStatus[];
    link?: string;
    need: boolean;
    drops: DropStatus[];
}

export interface CharacterStatus {
    id: number;
    types: RewardType[];
}

export interface DropStatus {
    need: boolean;
    skip: boolean;
    validCharacters: boolean;
    characterIds: number[];
    completedCharacterIds: number[];
    setHave?: number;
    setNeed?: number;
    setNote?: string;
}
