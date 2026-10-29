import { DbResetType } from '@/shared/stores/db/enums';
import type { Chore, Task } from '@/types/tasks';
import { threeDayDecorator } from '../utils';
import { Holiday } from '@/enums/holiday';
import { holidayToCallingQuest } from '@/data/holidays';
import { dynamicDataStore } from '@/user-home/stores/dynamicData.svelte';

export const callingChoreData = (holiday: Holiday, questIds: number[]): Partial<Chore> => {
    const callingQuestId = holidayToCallingQuest[holiday];
    return {
        noTooltipIcon: true,
        questReset: DbResetType.Custom,
        questResetForced: true,
        questIds,
        requiredHolidays: [holiday],
        customExpiryFunc: (chore, char, scannedAt, questIds) => {
            const dynamicData = dynamicDataStore.getCached(char.region);
            const activeEmissaryQuests = Object.values(dynamicData.emissaryQuests).flat();
            return activeEmissaryQuests.find((eq) => eq.questId === callingQuestId)?.expiresAt;
        },
        decorationFunc: threeDayDecorator,
    };
};

export const slCallings: Task = {
    key: 'slCallings',
    name: '[SL] Callings',
    shortName: 'SL',
    minimumLevel: 60,
    showSeparate: true,
    chores: [
        {
            key: 'animaSalvage',
            name: 'Anima Salvage',
            ...callingChoreData(Holiday.CallingAnimaSalvage, [60457, 60458, 60459, 60460]),
        },
        {
            key: 'rareResources',
            name: 'Rare Resources',
            ...callingChoreData(Holiday.CallingRareResources, [60414, 60415, 60416, 60417]),
        },
        {
            key: 'stormTheMaw',
            name: 'Storm the Maw',
            ...callingChoreData(Holiday.CallingStormTheMaw, [60452, 60454, 60455, 60456]),
        },

        {
            key: 'aidingArdenweald',
            name: 'Ardenweald Aiding',
            ...callingChoreData(Holiday.CallingAidingArdenweald, [60381, 60389, 60390, 60391]),
        },
        {
            key: 'callArdenweald',
            name: 'Ardenweald Call',
            ...callingChoreData(Holiday.CallingCallArdenweald, [60419, 60422, 60423, 60424]),
        },
        {
            key: 'challengesArdenweald',
            name: 'Ardenweald Challenges',
            ...callingChoreData(Holiday.CallingChallengesArdenweald, [60438, 60439, 60440, 60441]),
        },
        {
            key: 'trainingArdenweald',
            name: 'Ardenweald Training',
            ...callingChoreData(Holiday.CallingTrainingArdenweald, [60388, 60401, 60402, 60403]),
        },

        {
            key: 'aidingBastion',
            name: 'Bastion Aiding',
            ...callingChoreData(Holiday.CallingAidingBastion, [60384, 60392, 60393, 60394]),
        },
        {
            key: 'callBastion',
            name: 'Bastion Call',
            ...callingChoreData(Holiday.CallingCallBastion, [60418, 60425, 60426, 60427]),
        },
        {
            key: 'challengesBastion',
            name: 'Bastion Challenges',
            ...callingChoreData(Holiday.CallingChallengesBastion, [60437, 60442, 60443, 60444]),
        },
        {
            key: 'trainingBastion',
            name: 'Bastion Training',
            ...callingChoreData(Holiday.CallingTrainingBastion, [60387, 60404, 60405, 60406]),
        },

        {
            key: 'aidingMaldraxxus',
            name: 'Maldraxxus Aiding',
            ...callingChoreData(Holiday.CallingAidingMaldraxxus, [60383, 60395, 60396, 60397]),
        },
        {
            key: 'callMaldraxxus',
            name: 'Maldraxxus Call',
            ...callingChoreData(Holiday.CallingCallMaldraxxus, [60420, 60429, 60430, 60431]),
        },
        {
            key: 'challengesMaldraxxus',
            name: 'Maldraxxus Challenges',
            ...callingChoreData(Holiday.CallingChallengesMaldraxxus, [60436, 60445, 60446, 60447]),
        },
        {
            key: 'trainingMaldraxxus',
            name: 'Maldraxxus Training',
            ...callingChoreData(Holiday.CallingTrainingMaldraxxus, [60386, 60407, 60408, 60409]),
        },

        {
            key: 'aidingRevendreth',
            name: 'Revendreth Aiding',
            ...callingChoreData(Holiday.CallingAidingRevendreth, [60382, 60398, 60400, 60401]),
        },
        {
            key: 'callRevendreth',
            name: 'Revendreth Call',
            ...callingChoreData(Holiday.CallingCallRevendreth, [60421, 60432, 60433, 60434]),
        },
        {
            key: 'challengesRevendreth',
            name: 'Revendreth Challenges',
            ...callingChoreData(Holiday.CallingChallengesRevendreth, [60435, 60448, 60449, 60450]),
        },
        {
            key: 'trainingRevendreth',
            name: 'Revendreth Training',
            ...callingChoreData(Holiday.CallingTrainingRevendreth, [60385, 60410, 60411, 60412]),
        },
    ],
};
