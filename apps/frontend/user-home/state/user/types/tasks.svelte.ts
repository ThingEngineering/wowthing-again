import { QuestStatus } from '@/enums/quest-status';
import type { UserQuestDataCharacterProgress } from '@/types/data';

export class CharacterChore {
    anyReady = false;
    countCompleted = 0;
    countStarted = 0;
    countTotal = 0;
    name: string;
    status = QuestStatus.NotStarted;
    tasks: CharacterChoreTask[] = [];
}

export class CharacterChoreTask {
    name: string;
    skipped = false;
    status: QuestStatus = QuestStatus.NotStarted;
    statusTexts: string[] = [];

    constructor(
        public key: string,
        public quest: UserQuestDataCharacterProgress
    ) {}
}

export interface CharacterTask {
    quest: UserQuestDataCharacterProgress;
    status: string;
    text: string;
}
