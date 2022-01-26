export interface StaticDataConnectedRealm {
    id: number
    displayText: string
    realmNames: string[]
}

export class StaticDataRealm {
    constructor(
        public id: number,
        public region: number,
        public connectedRealmId: number,
        public name: string,
        public slug: string
    )
    { }
}
export type StaticDataRealmArray = ConstructorParameters<typeof StaticDataRealm>
