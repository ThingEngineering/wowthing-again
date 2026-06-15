import type { RewardType } from '@/enums/reward-type';
import type { DateTime } from 'luxon';

export interface ApiWorldQuest {
    expires: DateTime;
    locationX: string;
    locationY: string;
    questId: number;
    rewards: [number, ApiWorldQuestReward[]][];
}

export interface ApiWorldQuestReward {
    amount: number;
    id: number;
    type: RewardType;
}

export type WorldQuestZone = {
    id: number;
    mapName: string;
    name: string;
    slug: string;
    children?: WorldQuestZone[];
    continentPoint?: [number, number];
    anchor?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
};
