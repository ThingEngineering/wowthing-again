export class CharacterClass {
    constructor(
        public id: number,
        public name: string,
        public icon: string,
        public specializationIds: number[],
    )
    { }

    get mask(): number {
        return 2 ** (this.id - 1)
    }
}
