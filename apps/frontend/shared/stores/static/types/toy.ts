export class StaticDataToy {
    constructor(
        public id: number,
        public sourceType: number,
        public itemId: number,
        public name: string,
    ) {}
}
export type StaticDataToyArray = ConstructorParameters<typeof StaticDataToy>;
