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

export class CharacterMythicPlusAddonMap {
    public fortifiedScore?: CharacterMythicPlusAddonMapAffix
    public tyrannicalScore?: CharacterMythicPlusAddonMapAffix

    constructor(
        public overallScore: number,
        fortifiedScoreArray?: CharacterMythicPlusAddonMapAffixArray,
        tyrannicalScoreArray?: CharacterMythicPlusAddonMapAffixArray
    ) {
        if (fortifiedScoreArray) {
            this.fortifiedScore = new CharacterMythicPlusAddonMapAffix(...fortifiedScoreArray)
        }
        if (tyrannicalScoreArray) {
            this.tyrannicalScore = new CharacterMythicPlusAddonMapAffix(...tyrannicalScoreArray)
        }
    }
}
export type CharacterMythicPlusAddonMapArray = ConstructorParameters<typeof CharacterMythicPlusAddonMap>

export class CharacterMythicPlusAddonMapAffix {
    public overTime: boolean

    constructor(
        public level: number,
        public score: number,
        public durationSec: number,
        overTime: number
    ) {
        this.overTime = overTime === 1
    }
}
type CharacterMythicPlusAddonMapAffixArray = ConstructorParameters<typeof CharacterMythicPlusAddonMapAffix>

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
