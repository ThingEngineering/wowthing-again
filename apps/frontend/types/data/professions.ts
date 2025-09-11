import type { Profession } from '@/enums/profession';

export interface TaskProfessionQuest {
    itemId: number;
    points?: number;
    questId: number;
    source?: string;
    costs?: {
        amount: number;
        currencyId?: number;
        itemId?: number;
    }[];
}

export type TaskProfession = {
    id: Profession;
    subProfessionId: number;
    masterQuestId?: number;

    orderQuest?: TaskProfessionQuest;
    treatiseQuest?: TaskProfessionQuest;

    provideQuests?: TaskProfessionQuest[];
    taskQuests?: TaskProfessionQuest[];

    dropQuests?: TaskProfessionQuest[];
    gatherQuests?: TaskProfessionQuest[];

    bookQuests?: TaskProfessionQuest[];
    treasureQuests?: TaskProfessionQuest[];
};
