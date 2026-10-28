import type { DateTime } from 'luxon';

import { emissaryQuestToHoliday } from '@/data/quests';
import { Expansion } from '@/enums/expansion';
import { Holiday } from '@/enums/holiday';
import { timeState } from '@/shared/state/time.svelte';
import { DbResetType } from '@/shared/stores/db/enums';
import { dynamicDataStore } from '@/user-home/stores/dynamicData';
import type { Chore, Task } from '@/types/tasks';

const customExpiryFunc: Chore['customExpiryFunc'] = (chore, char, scannedAt, questIds) => {
    const dynamicData = dynamicDataStore.getCached(char.region);
    const activeEmissaryQuests = dynamicData.emissaryQuests[Expansion.BattleForAzeroth] || [];
    return activeEmissaryQuests.find(
        (eq) => emissaryQuestToHoliday[eq.questId] === chore.requiredHolidays[0]
    ).expiresAt;
};

const threeDayDecorator = (expires: DateTime) => {
    const daysRemaining = expires.diff(timeState.slowTime).toMillis() / 1000 / 86400;
    if (daysRemaining < 1) {
        return 'decorator-warn';
    } else if (daysRemaining < 2) {
        return 'decorator-shrug';
    } else {
        return 'decorator-success';
    }
};

const emissaryChore: Partial<Chore> = {
    alwaysStarted: true,
    overrideNeed: 4,
    questReset: DbResetType.Custom,
    questResetForced: true,
    customExpiryFunc,
    decorationFunc: threeDayDecorator,
};

export const bfaEmissaryQuests: Task = {
    key: 'bfaEmissaryQuests',
    name: '[BfA] Emissaries',
    shortName: 'BfA',
    showSeparate: true,
    sumChores: true,
    chores: [
        {
            key: 'proudmooreZandalari',
            name: 'Proudmoore/Zandalari',
            icon: ':faction-proudmoore-admiralty: :faction-zandalari-empire:',
            questIds: [50599, 50598],
            requiredHolidays: [Holiday.EmissaryProudmooreZandalari],
            ...emissaryChore,
        },
        {
            key: 'embersVoldunai',
            name: 'Embers/Voldunai',
            icon: ':faction-order-of-embers: :faction-voldunai:',
            questIds: [50600, 50603],
            requiredHolidays: [Holiday.EmissaryEmbersVoldunai],
            ...emissaryChore,
        },
        {
            key: 'stormsTalanjis',
            name: "Storm's/Talanji's",
            icon: ':faction-storms-wake: :faction-talanjis-expedition:',
            questIds: [50601, 50602],
            requiredHolidays: [Holiday.EmissaryStormsTalanjis],
            ...emissaryChore,
        },
        {
            key: 'legionHonorbound',
            name: 'Legion/Honorbound',
            icon: ':faction-7th-legion: :faction-the-honorbound:',
            questIds: [50605, 50606],
            requiredHolidays: [Holiday.EmissaryLegionHonorbound],
            ...emissaryChore,
        },
        {
            key: 'wavebladeUnshackled',
            name: 'Waveblade/Unshackled',
            icon: ':faction-waveblade-ankoan: :faction-the-unshackled:',
            questIds: [56119, 56120],
            requiredHolidays: [Holiday.EmissaryWavebladeUnshackled],
            ...emissaryChore,
        },
    ],
};
