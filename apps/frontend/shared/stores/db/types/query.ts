import type { DbThingType } from "../enums"

export interface DbDataQuery {
    maps?: string[]
    requirements?: string[]
    tags?: string[]
    type?: DbThingType
}
