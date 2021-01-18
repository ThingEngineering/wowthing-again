export class Dungeon {
    Id: number
    Name: string
    Abbreviation: string
    Icon: string

    constructor(id: number, name: string, abbreviation: string, icon: string) {
        this.Id = id
        this.Name = name
        this.Abbreviation = abbreviation
        this.Icon = icon
    }

    getTooltip(): object {
        return {
            content: `${this.Name}`
        }
    }
}
