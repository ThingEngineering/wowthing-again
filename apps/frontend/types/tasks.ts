import type { DbResetType } from '@/shared/stores/db/enums';
import type { Character } from './character';

export type Task = {
    minimumLevel?: number;
    maximumLevel?: number;
    requiredQuestId?: number;
    key: string;
    name: string;
    questIds?: number[];
    shortName: string;
    type?: string;
    /**
     * Function to check if this quest is current
     */
    isCurrentFunc?: (char: Character, questId: number) => boolean;
};

export type Chore = {
    accountWide?: boolean;
    noProgress?: boolean;
    showQuestName?: boolean;
    minimumLevel?: number;
    maximumLevel?: number;
    questIds?: number[];
    questReset?: DbResetType,
    subChores?: Chore[];
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
