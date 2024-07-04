import type { ManualDataVendorItem } from '@/types/data/manual';

export class ThingData {
    public classId: number;
    public difficulty: string;
    public extraParams: Record<string, string>;
    public linkId: number;
    public linkType: string;
    public quality: number;
    public tooltip: string;

    constructor(
        public item: ManualDataVendorItem,
        public userHas: boolean,
    ) {
        this.extraParams = {};
    }
}
