import { GlobalDailyQuest } from '@/types/data'
import { ItemQuality } from '@/types/enums'

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

export const globalDailyQuests: Record<number, GlobalDailyQuest> = Object.fromEntries(
    [
        // Ardenweald
        new GlobalDailyQuest(
            60381,
            ItemQuality.Rare,
            'Aiding Ardenweald',
            'Complete 3 World Quests',
        ),
        new GlobalDailyQuest(
            60388,
            ItemQuality.Rare,
            'Training in Ardenweald',
            'Complete 3 World Quests',
        ),
        new GlobalDailyQuest(
            60419,
            ItemQuality.Epic,
            'A Call to Ardenweald',
            'Fill the bar',
        ),
        new GlobalDailyQuest(
            60438,
            ItemQuality.Epic,
            'Challenges in Ardenweald',
            'Complete a dungeon or the Terrors in Tirna Scithe world quest',
        ),

        // Bastion
        new GlobalDailyQuest(
            60392,
            ItemQuality.Rare,
            'Aiding Bastion',
            'Complete 3 World Quests',
        ),
        new GlobalDailyQuest(
            60404,
            ItemQuality.Rare,
            'Training in Bastion',
            'Complete 3 World Quests',
        ),
        new GlobalDailyQuest(
            60425,
            ItemQuality.Epic,
            'A Call to Bastion',
            'Fill the bar',
        ),
        new GlobalDailyQuest(
            60442,
            ItemQuality.Epic,
            'Challenges in Bastion',
            'Complete a dungeon or the Disloyal Denizens world quest',
        ),

        // Maldraxxus
        new GlobalDailyQuest(
            60396,
            ItemQuality.Rare,
            'Aiding Maldraxxus',
            'Complete 3 World Quests',
        ),
        new GlobalDailyQuest(
            60408,
            ItemQuality.Rare,
            'Training in Maldraxxus',
            'Complete 3 World Quests',
        ),
        new GlobalDailyQuest(
            60429,
            ItemQuality.Epic,
            'A Call to Maldraxxus',
            'Fill the bar',
        ),
        new GlobalDailyQuest(
            60445,
            ItemQuality.Epic,
            'Challenges in Maldraxxus',
            'Complete a dungeon or the Chosen Champions world quest',
        ),

        // Revendreth
        new GlobalDailyQuest(
            60399,
            ItemQuality.Rare,
            'Aiding Revendreth',
            'Complete 3 World Quests',
        ),
        new GlobalDailyQuest(
            60410,
            ItemQuality.Rare,
            'Training in Revendreth',
            'Complete 3 World Quests',
        ),
        new GlobalDailyQuest(
            60432,
            ItemQuality.Epic,
            'A Call to Revendreth',
            'Fill the bar',
        ),
        new GlobalDailyQuest(
            60448,
            ItemQuality.Epic,
            'Challenges in Revendreth',
            'Complete a dungeon or the Destroy the Dominant world quest',
        ),
        
        // Misc
        new GlobalDailyQuest(
            60424,
            ItemQuality.Rare,
            'Anima Salvage',
            'Gather 150 Anima Embers from Torghast',
        ),
        new GlobalDailyQuest(
            60415,
            ItemQuality.Rare,
            'Rare Resources',
            'Collect 3 Coins of Brokerage from rares/treasures',
        ),
        new GlobalDailyQuest(
            60454,
            ItemQuality.Epic,
            'Storm the Maw',
            'Kill 3 rare or special encounter bosses in The Maw',
        )
    ]
    .map((gdq) => [gdq.id, gdq])
)
