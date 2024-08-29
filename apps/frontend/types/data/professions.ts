import type { Profession } from '@/enums/profession';

interface TaskProfessionQuest {
    itemId: number;
    points?: number;
    questId: number;
    source?: string;
}

export type TaskProfession = {
    id: Profession;
    subProfessionId: number;
    hasOrders?: boolean;
    hasTask?: boolean;
    masterQuestId?: number;

    bookQuests?: TaskProfessionQuest[];
    dropQuests?: TaskProfessionQuest[];
    treasureQuests?: TaskProfessionQuest[];
};
