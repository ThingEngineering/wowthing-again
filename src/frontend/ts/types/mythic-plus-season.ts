class MythicPlusSeason {
    Id: number
    MinLevel: number
    Orders: number[][]

    constructor(id: number, minLevel: number, orders: number[][]) {
        this.Id = id
        this.MinLevel = minLevel
        this.Orders = orders
    }
}

export {
    MythicPlusSeason,
}
