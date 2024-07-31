export interface CharacterShadowlands {
    covenantId: number
    renownLevel: number
    soulbindId: number
    conduits: number[][]
    covenants: Record<number, CharacterShadowlandsCovenant>
}

export interface CharacterShadowlandsCovenant {
    anima: number
    renown: number
    souls: number
    conductor: CharacterShadowlandsCovenantFeature
    missions: CharacterShadowlandsCovenantFeature
    transport: CharacterShadowlandsCovenantFeature
    unique: CharacterShadowlandsCovenantFeature
    soulbinds: CharacterShadowlandsSoulbind[]
}

export interface CharacterShadowlandsCovenantFeature {
    rank: number
    researchEnds: number
    name: string
}

export interface CharacterShadowlandsSoulbind {
    id: number
    specializations: number[]
    tree: number[][]
    unlocked: boolean
}
