import type { DateTime } from 'luxon';

import type { Profession } from '@/enums/profession';

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
    minimumLevel?: number;
    unimportant?: boolean;
    ids: number[];
}

export interface ProfessionCooldownSpell {
    type: 'spell';
    key: string;
    name: string;
    profession: Profession;
    unimportant?: boolean;
    cooldown: number[][];
}
