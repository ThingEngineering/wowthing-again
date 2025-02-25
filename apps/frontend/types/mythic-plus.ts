import type { MythicPlusScoreType } from '@/enums/mythic-plus-score-type';

export class MythicPlusSeason {
    public id: number;
    public name: string;
    public slug: string;
    public endPeriod?: number;
    public minLevel: number;
    public orders: number[][];
    public portalLevel?: number;
    public scoreType?: MythicPlusScoreType;
    public startPeriod?: number;

    constructor(season: MythicPlusSeason) {
        Object.assign(this, season);
    }
}
