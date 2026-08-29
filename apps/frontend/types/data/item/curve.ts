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

export class DataItemOffsetCurve {
    constructor(
        public id: number,
        public curveId: number,
        public offset: number
    ) {}
}
export type DataItemOffsetCurveArray = ConstructorParameters<typeof DataItemOffsetCurve>;

export class DataItemScalingConfig {
    constructor(
        public id: number,
        public flags: number,
        public itemSquishEraId: number,
        public itemOffsetCurveId: number,
        public itemLevel: number,
        public requiredLevel: number
    ) {}
}
export type DataItemScalingConfigArray = ConstructorParameters<typeof DataItemScalingConfig>;
