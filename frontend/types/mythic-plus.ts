class MythicPlusAffix {
    Name: string

    constructor(name: string) {
        this.Name = name
    }
}

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
    MythicPlusAffix,
    MythicPlusSeason,
}
