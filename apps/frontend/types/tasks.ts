import type { DateTime } from 'luxon';

import type { Holiday } from '@/enums/holiday';
import type { DbResetType } from '@/shared/stores/db/enums';
import type { Icon } from '@/types/icons';
import type { Character } from './character';

export type Task = {
    key: string;
    name: string;
    shortName: string;
    icon?: Icon;
    maximumLevel?: number;
    minimumLevel?: number;
    requiredHolidays?: Holiday[];
    requiredQuestId?: number;
    showSeparate?: boolean;
    chores: Chore[];
};

export type Chore = {
    key: string;
    name: string;
    icon?: Icon;
    accountWide?: boolean;
    alwaysStarted?: boolean;
    noAlone?: boolean;
    showQuestName?: boolean;
    minimumLevel?: number;
    maximumLevel?: number;
    overrideNeed?: number;
    questCount?: number;
    questIds?: number[] | ((char: Character, chore?: Chore) => number[]);
    questReset?: DbResetType;
    questResetForced?: boolean;
    subChoresAnyOrder?: boolean;
    subChores?: Chore[];
    requiredHolidays?: Holiday[];

    /**
     * Function to manually calculate progress
     */
    progressFunc?: (char: Character) => { have: number; need: number };
    /**
     * Function to check if character is eligibile for this task (eg has a profession)
     */
    couldGetFunc?: (char: Character, chore?: Chore) => boolean;
    /**
     * Function to check if character is able to pick up this task (eg has a high enough skill)
     */
    canGetFunc?: (char: Character) => string;
    /**
     * Function to generate a custom expiry time
     */
    customExpiryFunc?: (char: Character, scannedAt: DateTime, questIds?: number[]) => DateTime;
    /**
     * Function to ????
     */
    decorationFunc?: (expires: DateTime) => string;
};
