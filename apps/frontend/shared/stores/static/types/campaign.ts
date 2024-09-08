export class StaticDataCampaign {
    constructor(
        public id: number,
        public questLineIds: number[],
    ) {}
}
export type StaticDataCampaignArray = ConstructorParameters<typeof StaticDataCampaign>;
