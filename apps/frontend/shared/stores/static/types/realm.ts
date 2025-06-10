export class StaticDataConnectedRealm {
    public displayText: string;
    public realmNames: string[] = [];

    constructor(
        public id: number,
        public region: number,
        public locale: string
    ) {}
}

export class StaticDataRealm {
    constructor(
        public id: number,
        public region: number,
        public connectedRealmId: number,
        public name: string,
        public slug: string,
        public locale: string,
        public englishName?: string
    ) {}
}
export type StaticDataRealmArray = ConstructorParameters<typeof StaticDataRealm>;
