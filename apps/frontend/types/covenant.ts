export class Covenant {
    constructor(
        public id: number,
        public name: string,
        public slug: string,
        public icon: string,
    ) {}

    getTooltip(renown: number): string {
        return `${this.name} Renown ${renown}`;
    }
}
