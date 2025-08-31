import { QuestStatus } from '@/enums/quest-status';
import type { UserQuestDataCharacterProgress } from '@/types/data';
import type { Chore, Task } from '@/types/tasks';

export class CharacterTask {
    public anyReady = false;
    public countCompleted = 0;
    public countStarted = 0;
    public countTotal = 0;
    public status = QuestStatus.NotStarted;
    public chores: Record<string, CharacterChore> = {};

    constructor(public task: Task) {}
}

// export interface CharacterTask {
//     quest: UserQuestDataCharacterProgress;
//     status: string;
//     text: string;
// }

export class CharacterChore {
    public name: string;
    public quest: UserQuestDataCharacterProgress;
    public status = QuestStatus.NotStarted;
    public statusTexts: string[] = [];

    constructor(public chore: Chore) {}
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
