import type { AppearanceDataAppearance } from './appearance';

export class AppearanceDataSet {
    public appearances: AppearanceDataAppearance[];

    constructor(
        public name: string,
        public sortKey: string,
    ) {
        this.appearances = [];
    }
}
