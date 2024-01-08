export interface CharacterMythicPlus {
    seasons: Record<number, Record<number, CharacterMythicPlusRun[]>>

    currentPeriodId: number
    rawSeasons: Record<number, Record<number, CharacterMythicPlusRunArray[]>>
}

export interface CharacterMythicPlusAddon {
    runs: Array<CharacterMythicPlusAddonRun>

    maps: Record<number, CharacterMythicPlusAddonMap>
    rawRuns: CharacterMythicPlusAddonRunArray[]
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

export class CharacterMythicPlusRun {
    constructor(
        public completed: string,
        public dungeonId: number,
        public keystoneLevel: number,
        public duration: number,
        public timed: boolean,
        public affixes: number[],
        public members?: CharacterMythicPlusRunMemberArray[],
        public memberObjects?: CharacterMythicPlusRunMember[]
    ) { }
}
export type CharacterMythicPlusRunArray = ConstructorParameters<typeof CharacterMythicPlusRun>

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
