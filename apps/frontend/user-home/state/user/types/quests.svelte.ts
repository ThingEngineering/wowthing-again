import cloneDeep from 'lodash/cloneDeep';
import { DateTime } from 'luxon';

import { timeState } from '@/shared/state/time.svelte';
import parseApiTime from '@/utils/parse-api-time';
import {
    UserQuestDataCharacterProgress,
    type UserQuestDataCharacterProgressArray,
} from '@/types/data';

type GoldWorldQuests = [number, number, number][];

export class CharacterQuests {
    public hasQuestById = $state.raw(new Set<number>());
    public progressQuestByKey = $state.raw(new Map<string, UserQuestDataCharacterProgress>());
    public scannedAt = $state<string>();
    public scannedTime = $state<DateTime>();
    public goldWorldQuests = $state<GoldWorldQuests>();

    constructor(public characterId: number) {}

    public process(
        scannedAt: string,
        questDiffs: number[],
        goldWorldQuests: GoldWorldQuests,
        progressQuestArrayMap: Record<string, UserQuestDataCharacterProgressArray>
    ) {
        if (scannedAt === this.scannedAt) {
            return;
        }

        const currentTime = timeState.time.toUnixInteger();
        this.scannedAt = scannedAt;
        this.scannedTime = parseApiTime(scannedAt);

        // Quest IDs are packed as an array of deltas to the previous value
        const questIds = new Set<number>();
        let lastQuestId = 0;
        for (const questDiff of questDiffs || []) {
            const questId = lastQuestId + questDiff;
            questIds.add(questId);
            lastQuestId = questId;
        }

        this.hasQuestById = questIds;

        // Gold world quests
        this.goldWorldQuests = cloneDeep(goldWorldQuests);

        // Progress
        const progressQuests = new Map<string, UserQuestDataCharacterProgress>();
        for (const [key, progressQuestArray] of Object.entries(progressQuestArrayMap || {})) {
            // skip any quests that we know are expired
            const expires = progressQuestArray[2];
            if (expires > 0 && expires < currentTime) {
                continue;
            }

            const progressQuest = new UserQuestDataCharacterProgress(...progressQuestArray);
            progressQuests.set(key, progressQuest);
        }

        this.progressQuestByKey = progressQuests;
    }
}
