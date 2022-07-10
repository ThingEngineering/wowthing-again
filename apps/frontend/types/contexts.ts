export interface CollectionContext {
    route: string
    thingMapFunc: (thing: number) => number
    thingType: string
    userHas: Record<number, boolean>
}
