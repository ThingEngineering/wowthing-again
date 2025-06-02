export class CharacterRace {
    id: number;
    name: string;
    // female, male
    icons: string[];

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;

        const safeName = name.toLowerCase().replace(/ /g, '_').replace(/'/g, '');
        this.icons = [`race_${safeName}_female`, `race_${safeName}_male`];
    }
}
