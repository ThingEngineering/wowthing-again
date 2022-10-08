export class ManualDataSharedItemSet {
    public modifier: number

    constructor(
        public name: string,
        public items: number[][],
        public tags: number[],
        modifier?: number,
    )
    {
        this.modifier = modifier || 0
    }
}
export type ManualDataSharedItemSetArray = ConstructorParameters<typeof ManualDataSharedItemSet>
