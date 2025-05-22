export class DbDataThingGroup {
    constructor(
        public name: string,
        public range: [number, number],
        public showNormalTag?: boolean,
        public sortKey?: string,
        public bonusIds?: number[],
    ) {}
}

export type DbDataThingGroupArray = ConstructorParameters<typeof DbDataThingGroup>;
