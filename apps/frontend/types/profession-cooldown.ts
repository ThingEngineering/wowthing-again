import type { DateTime } from 'luxon';

import type { Profession } from '@/enums/profession';
import type { DbResetType } from '@/shared/stores/db/enums';

export interface ProfessionCooldown {
    data: ProfessionCooldownQuest | ProfessionCooldownSpell;
    have: number;
    max: number;
    minimumLevel?: number;
    unimportant?: boolean;
    seconds: number;
    full: DateTime;
}

export interface ProfessionCooldownQuest {
    type: 'quest';
    key: string;
    name: string;
    profession: Profession;
    subProfessionId?: number;
    minimumLevel?: number;
    reset?: DbResetType;
    unimportant?: boolean;
    ids: number[];
}

export interface ProfessionCooldownSpell {
    type: 'spell';
    key: string;
    name: string;
    profession: Profession;
    subProfessionId?: number;
    unimportant?: boolean;
    cooldown: number[][];
}
