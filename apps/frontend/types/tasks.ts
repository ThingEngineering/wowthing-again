import type { DateTime } from 'luxon';
import type { Component } from 'svelte';
import type { SvelteHTMLElements } from 'svelte/elements';
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
    icon?: IconifyIcon | Component<SvelteHTMLElements['svg']>;
    accountWide?: boolean;
    alwaysStarted?: boolean;
    noAlone?: boolean;
    showQuestName?: boolean;
    minimumLevel?: number;
    maximumLevel?: number;
    questIds?: number[] | ((char: Character, chore?: Chore) => number[]);
    questReset?: DbResetType;
    questResetForced?: boolean;
    subChoresAnyOrder?: boolean;
    subChores?: Chore[];
    requiredHolidays?: Holiday[];
    progressFunc?: (char: Character) => { have: number; need: number };
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
