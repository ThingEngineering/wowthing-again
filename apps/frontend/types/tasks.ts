import type { DateTime } from 'luxon';
import type { IconifyIcon } from '@iconify/types';

import type { Holiday } from '@/enums/holiday';
import type { DbResetType } from '@/shared/stores/db/enums';
import type { Character } from './character';

export type Task = {
    key: string;
    name: string;
    shortName: string;
    icon?: IconifyIcon;
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
    icon?: IconifyIcon;
    accountWide?: boolean;
    noAlone?: boolean;
    noProgress?: boolean;
    showQuestName?: boolean;
    minimumLevel?: number;
    maximumLevel?: number;
    questIds?: number[] | ((char: Character, chore?: Chore) => number[]);
    questReset?: DbResetType;
    questResetForced?: boolean;
    subChoresAnyOrder?: boolean;
    subChores?: Chore[];
    requiredHolidays?: Holiday[];
    /**
     * Function to check if character is eligibile for this task (eg has a profession)
     */
    couldGetFunc?: (char: Character, chore?: Chore) => boolean;
    /**
     * Function to check if character is able to pick up this task (eg has a high enough skill)
     */
    canGetFunc?: (char: Character) => string;

    customExpiryFunc?: (char: Character, scannedAt: DateTime) => DateTime;
    decorationFunc?: (expires: DateTime) => string;
};
