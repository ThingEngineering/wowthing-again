export const progressQuests: Record<string, string[]> = {
    'allAnima': ['kyrianAnima', 'necrolordAnima', 'nightFaeAnima', 'venthyrAnima'],
    'allSouls': ['kyrianSouls', 'necrolordSouls', 'nightFaeSouls', 'venthyrSouls'],
}

export const progressQuestMap: Record<string, string> = {
    weeklyKorthia: 'shapingFate',
    weeklyPatterns: 'patterns',
}

export const progressQuestHead: Record<string, string> = {
    weeklyAnima: 'Anima',
    weeklyHoliday: 'Holiday',
    weeklyKorthia: 'Korthia',
    weeklyPatterns: 'Zereth',
    weeklyPvp: 'PvP',
    weeklySouls: 'Souls',
}

export const progressQuestTitle: Record<string, string> = {
    weeklyAnima: 'Replenish the Reservoir',
    weeklyHoliday: 'Weekly Holiday Quest',
    weeklyKorthia: 'Korthia',
    weeklyPatterns: 'Patterns Within Patterns',
    weeklyPvp: 'Weekly PvP Quest',
    weeklySouls: 'Souls',
}

export const forcedReset: Record<string, boolean> = {
    kyrianSouls: true,
    necrolordSouls: true,
    nightFaeSouls: true,
    venthyrSouls: true,
    weeklyHoliday: true,
    weeklyPvP: true,
    weeklySouls: true,
}

export const holidayQuestCycle: string[] = [
    'Dng',
    'Pets',
    'TW',
    'Arena',
    'WQs',
    'TW',
    'BGs',

    'Dng',
    'TW',
    'Pets',
    'Arena',
    'TW',
    'WQs',
    'BGs',
    'TW',
]
