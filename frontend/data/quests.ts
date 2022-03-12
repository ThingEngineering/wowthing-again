export const progressQuests: Record<string, string[]> = {
    'allAnima': ['kyrianAnima', 'necrolordAnima', 'nightFaeAnima', 'venthyrAnima'],
    'allSouls': ['kyrianSouls', 'necrolordSouls', 'nightFaeSouls', 'venthyrSouls'],
}

export const progressQuestMap: Record<string, string> = {
    weeklyKorthia: 'shapingFate',
    weeklyPatterns: 'patterns',
}

export const progressQuestTitle: Record<string, string> = {
    weeklyAnima: 'Anima',
    weeklyHoliday: 'Holiday',
    weeklyKorthia: 'Korthia',
    weeklyPatterns: 'ZM',
    weeklySouls: 'Souls',
}

export const forcedReset: Record<string, boolean> = {
    kyrianSouls: true,
    necrolordSouls: true,
    nightFaeSouls: true,
    venthyrSouls: true,
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
