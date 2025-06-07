import type { DbThingContentType } from '../enums';

export class DbDataThingContent {
    public costs: Record<number, number> = {};

    constructor(
        public type: DbThingContentType,
        public id: number,
        public trackingQuestId: number,
        public note: string,
        public requirementIds: number[],
        public tagIds: number[],
        costArrays: [number, number][],
    ) {
        for (const [currencyId, currencyAmount] of costArrays) {
            this.costs[currencyId] = currencyAmount;
        }
    }
}
export type DbDataThingContentArray = ConstructorParameters<typeof DbDataThingContent>;
