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
    hasOrders?: boolean;
    hasTasks?: boolean;
    masterQuestId?: number;

    bookQuests?: TaskProfessionQuest[];
    dropQuests?: TaskProfessionQuest[];
    treasureQuests?: TaskProfessionQuest[];
};
