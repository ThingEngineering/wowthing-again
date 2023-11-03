export class DbDataThingLocation {
    public xCoordinate: string
    public yCoordinate: string

    constructor(
        packedLocation: number
    ) {
        // 12345678 => x: 12.34, y: 56.78
        this.xCoordinate = (Math.floor(packedLocation / 10000) / 100).toFixed(2)
        this.yCoordinate = ((packedLocation % 10000) / 100).toFixed(2)
    }
}
