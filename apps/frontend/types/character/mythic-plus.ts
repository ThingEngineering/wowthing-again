export interface CharacterMythicPlus {
    currentPeriodId: number
    periodRuns: Record<number, CharacterMythicPlusRun[]>
    seasons: Record<number, Record<number, CharacterMythicPlusRun[]>>
}

export interface CharacterMythicPlusAddon {
    maps: Record<number, CharacterMythicPlusAddonMap>
    runs: Array<CharacterMythicPlusAddonRun>
    season: number
}

export class CharacterMythicPlusAddonRun {
    constructor(
        public mapId: number,
        public level: number,
        public score: number,
        public completed: boolean
    ) { }
}
export type CharacterMythicPlusAddonRunArray = ConstructorParameters<typeof CharacterMythicPlusAddonRun>

export interface CharacterMythicPlusAddonMap {
    overallScore: number
    fortifiedScore: CharacterMythicPlusAddonMapAffix
    tyrannicalScore: CharacterMythicPlusAddonMapAffix
}

export interface CharacterMythicPlusAddonMapAffix {
    durationSec: number
    level: number
    overTime: boolean
    score: number
}

export interface CharacterMythicPlusRun {
    affixes: number[]
    completed: string
    dungeonId: number
    duration: number
    keystoneLevel: number
    members: CharacterMythicPlusRunMemberArray[]
    memberObjects: CharacterMythicPlusRunMember[]
    timed: boolean
}

export class CharacterMythicPlusRunMember {
    constructor(
        public realmId: number,
        public name: string,
        public specializationId: number,
        public itemLevel: number
    )
    { }
}

type CharacterMythicPlusRunMemberArray = ConstructorParameters<typeof CharacterMythicPlusRunMember>
