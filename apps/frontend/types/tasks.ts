import type { Character } from './character'


export type Task = {
    minimumLevel?: number
    maximumLevel?: number
    requiredQuestId?: number
    key: string
    name: string
    shortName: string
    type?: string
}

export type Chore = {
    minimumLevel?: number,
    maximumLevel?: number,
    taskKey: string,
    taskName: string,
    canGetFunc?: (char: Character) => string
    couldGetFunc?: (char: Character) => boolean
}
