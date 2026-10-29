import type { DateTime } from 'luxon';

import { emissaryQuestToHoliday, holidayToReputations } from '@/data/reputation';
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

const holidayData = (holiday: Holiday): Partial<Chore> => {
    const reputations = holidayToReputations[holiday] || [];
    return {
        questIds: reputations.map((rep) => rep.emissaryQuestId),
        requiredHolidays: [holiday],
    };
};

export const bfaEmissaryQuests: Task = {
    key: 'bfaEmissaryQuests',
    name: '[BfA] Emissaries',
    shortName: 'BfA',
    showSeparate: true,
    sumChores: true,
    chores: [
        {
            key: 'champions',
            name: 'Champions of Azeroth',
            icon: '{factionIcon:BfaChampionsOfAzeroth}',
            ...holidayData(Holiday.EmissaryChampionsAzeroth),
            ...emissaryChore,
        },
        {
            key: 'tortollans',
            name: 'Tortollans',
            icon: '{factionIcon:BfaTortollans}',
            ...holidayData(Holiday.EmissaryTortollans),
            ...emissaryChore,
        },
        {
            key: 'proudmooreZandalari',
            name: 'Proudmoore/Zandalari',
            icon: '{factionIcon:BfaProudmooreAdmiralty} {factionIcon:BfaZandalariEmpire}',
            ...holidayData(Holiday.EmissaryProudmooreZandalari),
            ...emissaryChore,
        },
        {
            key: 'embersVoldunai',
            name: 'Embers/Voldunai',
            icon: '{factionIcon:BfaOrderOfEmbers} {factionIcon:BfaVoldunai}',
            ...holidayData(Holiday.EmissaryEmbersVoldunai),
            ...emissaryChore,
        },
        {
            key: 'stormsTalanjis',
            name: "Storm's/Talanji's",
            icon: '{factionIcon:BfaStormsWake} {factionIcon:BfaTalanjisExpedition}',
            ...holidayData(Holiday.EmissaryStormsTalanjis),
            ...emissaryChore,
        },
        {
            key: 'legionHonorbound',
            name: 'Legion/Honorbound',
            icon: '{factionIcon:Bfa7thLegion} {factionIcon:BfaTheHonorbound}',
            ...holidayData(Holiday.EmissaryLegionHonorbound),
            ...emissaryChore,
        },
        {
            key: 'wavebladeUnshackled',
            name: 'Waveblade/Unshackled',
            icon: '{factionIcon:BfaWavebladeAnkoan} {factionIcon:BfaTheUnshackled}',
            ...holidayData(Holiday.EmissaryWavebladeUnshackled),
            ...emissaryChore,
        },
    ],
};
