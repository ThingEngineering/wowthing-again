export interface StaticDataProfession {
    id: number
    name: string
    slug: string
    type: number
    subProfessions: StaticDataSubProfession[]
}

export interface StaticDataSubProfession {
    id: number
    name: string
}
