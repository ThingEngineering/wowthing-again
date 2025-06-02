import type { QuestInfoFlags, QuestInfoType } from '@/shared/stores/static/enums';

export class StaticDataQuestInfo {
    constructor(
        public id: number,
        public type: QuestInfoType,
        public flags: QuestInfoFlags,
        public professionId: number,
        public name: string,
    ) {}
}
export type StaticDataQuestInfoArray = ConstructorParameters<typeof StaticDataQuestInfo>;
