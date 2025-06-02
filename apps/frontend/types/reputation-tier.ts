export class ReputationTier {
    constructor(
        public name: string,
        public tier: number,
        public maxValue: number,
        public value: number,
        public percent: string,
    ) {}
}
