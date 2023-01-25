export interface CollectibleContext {
    route: string
    thingMapFunc: (thing: number) => number
    thingType: string
    userHas: Record<number, boolean>
}
