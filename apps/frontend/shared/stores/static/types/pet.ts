export class StaticDataPet {
    constructor(
        public id: number,
        public sourceType: number,
        public petType: number,
        public creatureId: number,
        public spellId: number,
        public name: string,
        public itemIds: number[],
    ) {}
}
export type StaticDataPetArray = ConstructorParameters<typeof StaticDataPet>;
