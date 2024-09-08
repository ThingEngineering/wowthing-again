export class StaticDataCampaign {
    constructor(
        public id: number,
        public questLineIds: number[],
        public name: string,
    ) {}
}
export type StaticDataCampaignArray = ConstructorParameters<typeof StaticDataCampaign>;
