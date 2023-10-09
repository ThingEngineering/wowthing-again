export class StaticDataTransmogSet {
    constructor(
        public id: number,
        public name: string,
        public classMask: number,
        public flags: number,
        public items: [number, number?][]
    )
    { }
    
    get allianceOnly(): boolean {
        return (this.flags & 0x4) > 0
    }

    get hordeOnly(): boolean {
        return (this.flags & 0x8) > 0
    }
}
export type StaticDataTransmogSetArray = ConstructorParameters<typeof StaticDataTransmogSet>
