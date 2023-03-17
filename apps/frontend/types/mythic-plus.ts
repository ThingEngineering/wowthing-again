export class MythicPlusSeason {
    constructor(
        public id: number,
        public name: string,
        public slug: string,
        public minLevel: number,
        public orders: number[][],
        public startPeriod?: number,
        public endPeriod?: number
    )
    {}
}
