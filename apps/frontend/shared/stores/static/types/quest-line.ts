export class StaticDataQuestLine {
    constructor(
        public id: number,
        public questLineIds: number[],
    ) {}
}
export type StaticDataQuestLineArray = ConstructorParameters<typeof StaticDataQuestLine>;
