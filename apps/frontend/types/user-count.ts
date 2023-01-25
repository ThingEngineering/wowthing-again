export class UserCount {
    constructor(
        public have: number = 0,
        public total: number = 0,
    ) {
    }

    get percent(): number {
        return this.total > 0 ? this.have / this.total * 100 : 0
    }
}
