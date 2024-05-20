export class ManualDataTransmogCategory {
    public groups: ManualDataTransmogGroup[];

    constructor(
        public name: string,
        public slug: string,
        groupArrays: ManualDataTransmogGroupArray[],
        public skipClasses?: string[],
    ) {
        this.groups = groupArrays.map((groupArray) => new ManualDataTransmogGroup(...groupArray));
    }
}
export type ManualDataTransmogCategoryArray = ConstructorParameters<
    typeof ManualDataTransmogCategory
>;

export class ManualDataTransmogGroup {
    public data: Record<string, ManualDataTransmogGroupData[]>;

    constructor(
        public name: string,
        public type: string,
        public sets: string[],
        dataRaw: [string, ManualDataTransmogGroupDataArray[]][],
        public tag?: string,
    ) {
        this.data = {};
        for (const [key, dataArrays] of dataRaw) {
            this.data[key] = dataArrays.map(
                (dataArray) => new ManualDataTransmogGroupData(...dataArray),
            );
        }
    }
}
export type ManualDataTransmogGroupArray = ConstructorParameters<typeof ManualDataTransmogGroup>;

export class ManualDataTransmogGroupData {
    constructor(
        public name: string,
        public items: Record<number, number[]>,
        public wowheadSetId?: number,
        public transmogSetId?: number,
        public questId?: number,
        public achievementId?: number,
    ) {}
}
export type ManualDataTransmogGroupDataArray = ConstructorParameters<
    typeof ManualDataTransmogGroupData
>;
