import { derived } from 'svelte/store';

import { timeStore } from '@/shared/stores/time';
import { userQuestStore, userStore } from '@/stores';
import { getNextDailyResetFromTime, getNextWeeklyResetFromTime } from '@/utils/get-next-reset';
import { DbResetType } from '@/shared/stores/db/enums';
import type { UserQuestData } from '@/types/data';

export const testFunction = derived(
    [timeStore, userStore, userQuestStore],
    ([$timeStore, $userStore, $userQuestStore]) => {
        return (characterId: number, questId: number, reset?: DbResetType) => {
            const charData = $userQuestStore.characters[characterId];
            if (!charData) {
                return false;
            }

            const completed = charData.quests?.has(questId);
            if (!completed) {
                return false;
            }

            if (reset === DbResetType.Weekly) {
                const nextReset = getNextWeeklyResetFromTime(
                    charData.scannedTime,
                    $userStore.characterMap[characterId].region,
                );
                return nextReset > $timeStore;
            } else if (reset === DbResetType.Daily) {
                const nextReset = getNextDailyResetFromTime(
                    charData.scannedTime,
                    $userStore.characterMap[characterId].region,
                );
                return nextReset > $timeStore;
            }

            return true;
        };
    },
);

export function hasCharacterCompletedQuest(
    userQuestData: UserQuestData,
    characterId: number,
    questId: number,
    reset?: DbResetType,
): boolean {
    const charData = userQuestData.characters[characterId];
    const completed = charData?.quests?.has(questId);

    if (reset !== undefined) {
    }

    return completed;
}
