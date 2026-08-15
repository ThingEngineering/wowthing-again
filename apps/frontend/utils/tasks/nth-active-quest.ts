import { timeState } from '@/shared/state/time.svelte';
import { dynamicDataStore } from '@/user-home/stores/dynamicData';
import type { Character } from '@/types/character';
import type { Chore } from '@/types/tasks';

export const nthActiveQuest = (questIds: number[], index: number) => {
    return (char: Character, chore: Chore) => {
        const now = timeState.slowTime;
        const allWorldQuests = dynamicDataStore.getCachedQuests(char.region);
        const questIdIndexes = Object.fromEntries(
            allWorldQuests
                .filter((worldQuest) => worldQuest.expires > now)
                .map((worldQuest, index) => [worldQuest.questId, index])
        );

        const activeQuests = questIds
            .filter((questId) => questIdIndexes[questId])
            .map((questId) => [questIdIndexes[questId], questId]);
        activeQuests.sort((a, b) => a[0] - b[0]);

        if (activeQuests[index]) {
            return [activeQuests[index][1]];
        } else {
            return questIds;
        }
    };
};
