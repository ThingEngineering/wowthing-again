export class BackgroundImage {
    constructor(
        public id: number,
        public filename: string,
        public description: string,
        public attribution: string,
        public defaultBrightness: number = 10,
        public defaultSaturate: number = 10
    ) {}
}
