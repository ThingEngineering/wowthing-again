export class StaticDataPet {
    constructor(
        public id: number,
        public sourceType: number,
        public petType: number,
        public creatureId: number,
        public itemId: number,
        public spellId: number,
        public name: string,
    ) {}
}
export type StaticDataPetArray = ConstructorParameters<typeof StaticDataPet>;
