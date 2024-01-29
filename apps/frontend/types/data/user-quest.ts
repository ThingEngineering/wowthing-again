import type { QuestStatus } from '@/enums/quest-status'


export interface UserQuestData {
    accountHas: Set<number>
    account: number[]
    characters: Record<number, UserQuestDataCharacter>

    questNames: Record<string, string>
}

export interface UserQuestDataCharacter {
    scannedAt: string

    dailies: Record<number, number[][]>
    dailyQuestList: number[]
    questList: number[]
    rawProgressQuests?: Record<string, UserQuestDataCharacterProgressArray>

    // Computed
    dailyQuests?: Set<number>
    progressQuests?: Record<string, UserQuestDataCharacterProgress>
    quests?: Set<number>
}

export class UserQuestDataCharacterProgress {
    public objectives: UserQuestDataCharacterProgressObjective[]

    constructor(
        public id: number,
        public status: QuestStatus,
        public expires: number,
        public name: string,
        objectiveArrays: UserQuestDataCharacterProgressObjectiveArray[],
    ) {
        this.objectives = (objectiveArrays || [])
            .map((objectiveArray) => new UserQuestDataCharacterProgressObjective(...objectiveArray))
    }
}
type UserQuestDataCharacterProgressArray = ConstructorParameters<typeof UserQuestDataCharacterProgress>

export class UserQuestDataCharacterProgressObjective {
    constructor(
        public type: string,
        public have: number,
        public need: number,
        public text: string
    ) { }
}
type UserQuestDataCharacterProgressObjectiveArray = ConstructorParameters<typeof UserQuestDataCharacterProgressObjective>
