import type {Dictionary, StaticDataSetCategory} from '.'

export interface CollectionContext {
    slug: string
    route: string
    thingType: string
    thingMap: Dictionary<number>
    userHas: Dictionary<number>
    sets: StaticDataSetCategory[][]
}
