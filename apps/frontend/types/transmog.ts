export class TransmogSet {
    constructor(
        public type: string,
        public sets: TransmogSetData[],
    ) {}
}

export class TransmogSetData {
    constructor(
        public type: string,
        public span: number,
        public subType?: string,
    ) {}
}
