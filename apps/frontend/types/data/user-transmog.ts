export interface UserTransmogData {
    appearanceIds: number[]
    appearanceSources: string[]
    illusionIds: number[]

    appearanceMask?: Map<number, number>
    hasAppearance?: Set<number>
    hasIllusion?: Set<number>
    hasSource?: Set<string>
}
