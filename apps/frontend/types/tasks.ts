import type { Character } from './character'


export type Task = {
    minimumLevel?: number
    requiredQuestId?: number
    key: string
    name: string
    shortName: string
    type?: string
}

export type Chore = {
    minimumLevel?: number,
    taskKey: string,
    taskName: string,
    canGetFunc?: (char: Character) => string
    couldGetFunc?: (char: Character) => boolean
}
