import type { Dictionary, StaticDataSetCategory } from '.'

export interface CollectionContext {
    route: string
    thingType: string
    thingMap: Dictionary<number>
    userHas: Dictionary<boolean>
    sets: StaticDataSetCategory[][]
}
