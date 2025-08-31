import { get } from 'svelte/store';

import { QuestStatus } from '@/enums/quest-status';
import { DbResetType } from '@/shared/stores/db/enums';
import { userQuestStore, userStore } from '@/stores';
import { userState } from '@/user-home/state/user';
import type { Character } from '@/types';
import type { Chore, Task } from '@/types/tasks';

const chettIds = [
    86915, 86917, 86918, 86919, 86920, 86923, 86924, 87302, 87303, 87304, 87305, 87306, 87307,
];
function couldChett(char: Character, chore: Chore): boolean {
    // did they get the initial list yet?
    if (
        !userQuestStore.characterHas(char.id, 87296) &&
        userState.general.characterById[char.id]?.getItemCount(235053) === 0 &&
        userState.general.characterById[char.id]?.getItemCount(236682) === 0
    ) {
        return false;
    }

    // did they complete this task?
    const questId = chore.questIds[0];
    if (userQuestStore.characterHas(char.id, questId)) {
        return true;
    }

    const progressQuests = get(userQuestStore).characters[char.id]?.progressQuests || {};
    let completed = 0;
    let thisInProgress = false;

    for (const chettId of chettIds) {
        if (userQuestStore.characterHas(char.id, chettId)) {
            completed++;
        } else {
            const progressQuest = progressQuests[`q${chettId}`];
            if (progressQuest?.status === QuestStatus.InProgress && chettId === questId) {
                thisInProgress = true;
            }
        }
    }

    if (completed === 4) {
        return false;
    } else {
        return thisInProgress;
    }
}

export const twwChoresChett: Task = {
    key: 'twwChores11_1',
    name: '[TWW] 11.1.x',
    shortName: '11.1',
    minimumLevel: 80,
    showSeparate: true,
    chores: [
        {
            key: 'twwChettList',
            name: 'Get List!',
            questIds: [87296],
            questReset: DbResetType.Weekly,
            couldGetFunc: () => get(userStore).maxReputation.get(2653) >= 32500, // Cartels renown 13
        },
        {
            key: 'twwChett86915',
            name: 'Side with a Cartel',
            questIds: [86915],
            questReset: DbResetType.Weekly,
            couldGetFunc: (char, chore) => couldChett(char, chore),
        },
        {
            key: 'twwChett86919',
            name: 'Side Gig',
            questIds: [86919],
            questReset: DbResetType.Weekly,
            couldGetFunc: (char, chore) => couldChett(char, chore),
        },
        {
            key: 'twwChett87304',
            name: 'Excavation Site 9 delve',
            questIds: [87304],
            questReset: DbResetType.Weekly,
            couldGetFunc: (char, chore) => couldChett(char, chore),
        },
        {
            key: 'twwChett87303',
            name: 'Sidestreet Sluice delve',
            questIds: [87303],
            questReset: DbResetType.Weekly,
            couldGetFunc: (char, chore) => couldChett(char, chore),
        },
        {
            key: 'twwChett87305',
            name: '2x Car Race',
            questIds: [87305],
            questReset: DbResetType.Weekly,
            couldGetFunc: (char, chore) => couldChett(char, chore),
        },
        {
            key: 'twwChett87302',
            name: '3x Rare Mob',
            questIds: [87302],
            questReset: DbResetType.Weekly,
            couldGetFunc: (char, chore) => couldChett(char, chore),
        },
        {
            key: 'twwChett86924',
            name: '5x Battle Pet',
            questIds: [86924],
            questReset: DbResetType.Weekly,
            couldGetFunc: (char, chore) => couldChett(char, chore),
        },
        {
            key: 'twwChett86920',
            name: '5x War Mode Kill',
            questIds: [86920],
            questReset: DbResetType.Weekly,
            couldGetFunc: (char, chore) => couldChett(char, chore),
        },
        {
            key: 'twwChett86917',
            name: '10x Delivery Job',
            questIds: [86917],
            questReset: DbResetType.Weekly,
            couldGetFunc: (char, chore) => couldChett(char, chore),
        },
        {
            key: 'twwChett87307',
            name: '25x Trash Can/Dumpster',
            questIds: [87307],
            questReset: DbResetType.Weekly,
            couldGetFunc: (char, chore) => couldChett(char, chore),
        },
        {
            key: 'twwChett87306',
            name: '50x Car Can',
            questIds: [87306],
            questReset: DbResetType.Weekly,
            couldGetFunc: (char, chore) => couldChett(char, chore),
        },
        {
            key: 'twwChett86923',
            name: '50x Runoff Fishing',
            questIds: [86923],
            questReset: DbResetType.Weekly,
            couldGetFunc: (char, chore) => couldChett(char, chore),
        },
        {
            key: 'twwChett86918',
            name: '100x Empty Can',
            questIds: [86918],
            questReset: DbResetType.Weekly,
            couldGetFunc: (char, chore) => couldChett(char, chore),
        },
    ],
};
