export class StaticDataTransmogSet {
    constructor(
        public id: number,
        public name: string,
        public classMask: number,
        public flags: number,
        public items: [number, number?][]
    )
    {}
}
export type StaticDataTransmogSetArray = ConstructorParameters<typeof StaticDataTransmogSet>
