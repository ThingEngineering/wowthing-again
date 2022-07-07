export interface StaticDataProfession {
    id: number
    name: string
    type: number
    subProfessions: StaticDataSubProfession[]
}

export interface StaticDataSubProfession {
    id: number
    name: string
}
