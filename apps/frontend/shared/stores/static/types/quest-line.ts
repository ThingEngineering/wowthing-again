export class StaticDataQuestLine {
    constructor(
        public id: number,
        public questIds: number[],
        public name: string,
    ) {}
}
export type StaticDataQuestLineArray = ConstructorParameters<typeof StaticDataQuestLine>;
