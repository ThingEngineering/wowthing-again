export class StaticDataInstance {
    constructor(
        public id: number,
        public expansion: number,
        public name: string,
        public shortName: string,
    ) {}
}
export type StaticDataInstanceArray = ConstructorParameters<typeof StaticDataInstance>;
