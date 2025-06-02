export interface StaticDataConnectedRealm {
    displayText: string;
    id: number;
    locale: string;
    realmNames: string[];
    region: number;
}

export class StaticDataRealm {
    constructor(
        public id: number,
        public region: number,
        public connectedRealmId: number,
        public name: string,
        public slug: string,
        public locale: string,
        public englishName?: string,
    ) {}
}
export type StaticDataRealmArray = ConstructorParameters<typeof StaticDataRealm>;
