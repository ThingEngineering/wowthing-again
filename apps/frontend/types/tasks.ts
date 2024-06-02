import type { Character } from './character';

export type Task = {
    minimumLevel?: number;
    maximumLevel?: number;
    requiredQuestId?: number;
    key: string;
    name: string;
    shortName: string;
    type?: string;
    /**
     * Function to check if this quest is current
     */
    isCurrentFunc?: (char: Character, questId: number) => boolean;
};

export type Chore = {
    noProgress?: boolean;
    minimumLevel?: number;
    maximumLevel?: number;
    taskKey: string;
    taskName: string;
    /**
     * Function to check if character is eligibile for this task (eg has a profession)
     */
    couldGetFunc?: (char: Character) => boolean;
    /**
     * Function to check if character is able to pick up this task (eg has a high enough skill)
     */
    canGetFunc?: (char: Character) => string;
};
