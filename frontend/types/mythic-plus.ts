export class MythicPlusAffix {
    name: string

    constructor(name: string) {
        this.name = name
    }
}

export class MythicPlusSeason {
    constructor(
        public id: number,
        public name: string,
        public slug: string,
        public minLevel: number,
        public orders: number[][],
    )
    {}
}
