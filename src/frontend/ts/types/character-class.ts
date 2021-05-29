export class CharacterClass {
    id: number
    name: string
    icon: string
    specializationIds: number[]

    constructor(id: number, name: string, specializationIds: number[]) {
        this.id = id
        this.name = name
        this.specializationIds = specializationIds

        const safeName = name.toLowerCase().replace(/[' ]/g, '_')
        this.icon = `class_${safeName}`
    }
}
