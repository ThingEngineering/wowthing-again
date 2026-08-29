import type { CurveType } from '@/enums/curve-type';

export class DataCurve {
    public points: DataCurvePoint[];

    constructor(
        public id: number,
        public type: CurveType,
        pointsArray: number[]
    ) {
        // points are a single array of [threshold1, value1, ... thresholdN, valueN]
        this.points = [];
        for (let i = 0; i < pointsArray.length; i += 2) {
            this.points.push(new DataCurvePoint(pointsArray[i], pointsArray[i + 1]));
        }
    }
}
export type DataCurveArray = ConstructorParameters<typeof DataCurve>;

export class DataCurvePoint {
    constructor(
        public threshold: number,
        public value: number
    ) {}
}
