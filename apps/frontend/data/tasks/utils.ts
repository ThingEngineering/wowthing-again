import type { DateTime } from 'luxon';

import { emissaryQuestToHoliday, holidayToReputations } from '@/data/reputation';
import { Expansion } from '@/enums/expansion';
import { timeState } from '@/shared/state/time.svelte';
import { DbResetType } from '@/shared/stores/db/enums';
import { dynamicDataStore } from '@/user-home/stores/dynamicData';
import type { Holiday } from '@/enums/holiday';
import type { Chore } from '@/types/tasks';

export const threeDayDecorator = (expires: DateTime) => {
    const daysRemaining = expires.diff(timeState.slowTime).toMillis() / 1000 / 86400;
    if (daysRemaining < 1) {
        return 'decorator-warn';
    } else if (daysRemaining < 2) {
        return 'decorator-shrug';
    } else {
        return 'decorator-success';
    }
};

export const emissaryChoreData = (holiday: Holiday): Partial<Chore> => {
    const reputations = holidayToReputations[holiday] || [];
    return {
        alwaysStarted: true,
        noTooltipIcon: true,
        overrideNeed: 4,
        questReset: DbResetType.Custom,
        questResetForced: true,
        questIds: reputations.map((rep) => rep.emissaryQuestId),
        requiredHolidays: [holiday],
        customExpiryFunc: (chore, char, scannedAt, questIds) => {
            const dynamicData = dynamicDataStore.getCached(char.region);
            const activeEmissaryQuests = Object.values(dynamicData.emissaryQuests).flat();
            return activeEmissaryQuests.find(
                (eq) => emissaryQuestToHoliday[eq.questId] === chore.requiredHolidays[0]
            )?.expiresAt;
        },
        decorationFunc: threeDayDecorator,
    };
};
