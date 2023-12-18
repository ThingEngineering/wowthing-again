export interface SettingsView {
    id: string
    name: string

    groups: string[]
    groupBy: string[]
    sortBy: string[]

    commonFields: string[]
    homeFields: string[]

    homeLockouts: number[]
    homeTasks: string[]

    disabledChores: Record<string, string[]>
}
