export interface AchievementData {
    categories: AchievementDataCategory[]
}

export interface AchievementDataCategory {
    id: number
    name: string
    slug: string
    children: AchievementDataCategory[]
}
