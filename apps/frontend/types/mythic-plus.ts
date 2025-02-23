export class MythicPlusSeason {
    public id: number;
    public name: string;
    public slug: string;
    public minLevel: number;
    public portalLevel?: number;
    public orders: number[][];
    public startPeriod?: number;
    public endPeriod?: number;

    constructor(season: MythicPlusSeason) {
        Object.assign(this, season);
    }
}
