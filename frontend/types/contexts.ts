export interface CollectionContext {
    route: string
    thingType: string
    thingMap: Record<number, number>
    userHas: Record<number, boolean>
}
