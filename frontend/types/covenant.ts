export class Covenant {
    Name: string
    Icon: string

    constructor(name: string, icon: string) {
        this.Name = name
        this.Icon = icon
    }

    getTooltip(renown: number): string {
        return `${this.Name} Renown ${renown}`
    }
}
