export interface CollectibleContext {
    countsKey: string
    route: string
    thingMapFunc: (thing: number) => number
    thingType: string
    userHas: Record<number, boolean>
}
