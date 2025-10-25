export class StaticDataChallengeDungeon {
    constructor(
        public id: number,
        public expansion: number,
        public mapId: number,
        public name: string,
        public timerBreakpoints: [number, number, number]
    ) {}
}
export type StaticDataChallengeDungeonArray = ConstructorParameters<
    typeof StaticDataChallengeDungeon
>;
