import type { QuestInfoType } from '@/shared/enums/quest-info-type'


export class StaticDataQuestInfo {
    constructor(
        public id: number,
        public type: QuestInfoType,
        public professionId: number,
        public name: string
    )
    {}
}
export type StaticDataQuestInfoArray = ConstructorParameters<typeof StaticDataQuestInfo>
