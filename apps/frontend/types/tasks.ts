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
}
