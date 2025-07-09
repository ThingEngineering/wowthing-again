export class StaticDataTransmogSet {
    public items: [number, number][] = [];

    constructor(
        public id: number,
        public name: string,
        public classMask: number,
        public flags: number,
        public groupId: number,
        modifierItemArrays: number[][]
    ) {
        // [modifier, itemId1, addMe1, addMe2, ...]
        for (const modifierItemArray of modifierItemArrays) {
            const modifier = modifierItemArray[0];
            let lastId = 0;
            for (let i = 1; i < modifierItemArray.length; i++) {
                const itemId = modifierItemArray[i];
                this.items.push([lastId + itemId, modifier]);
                lastId += itemId;
            }
        }
    }

    get allianceOnly(): boolean {
        return (this.flags & 0x4) > 0;
    }

    get hordeOnly(): boolean {
        return (this.flags & 0x8) > 0;
    }
}
export type StaticDataTransmogSetArray = ConstructorParameters<typeof StaticDataTransmogSet>;
