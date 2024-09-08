import { ItemQuality } from '@/enums/item-quality';
import { GlobalDailyQuest } from '@/types/data';

export const progressQuestMap: Record<string, string> = {
    slKorthia: 'shapingFate',
    slNewDeal: 'newDeal',
    slZerethMortis: 'patterns',
};

export const progressQuestHead: Record<string, string> = {
    weeklyAnima: 'Anima',
    weeklyHoliday: 'Holiday',
    weeklyKorthia: 'Korthia',
    weeklyPatterns: 'Zereth',
    weeklyPvp: 'PvP',
    weeklySouls: 'Souls',
};

export const forcedReset: Record<string, boolean> = {
    holidayArena: true,
    holidayBattlegrounds: true,
    holidayDelves: true,
    holidayDungeons: true,
    holidayPetPvp: true,
    holidayTimewalking: true,
    holidayTimewalkingItem: true,
    holidayTimewalkingRaid: true,
    holidayWorldQuests: true,
    pvpArenas: true,
    pvpBattlegrounds: true,
    pvpBrawl: true,
    pvpOverwhelmingOdds: true,
    pvpSkirmishes: true,
    pvpSolo: true,
    pvpTeamwork: true,
    pvpWar: true,
    slSouls: true,
};

export const dailyQuestLevel: Record<number, number> = {
    6: 45,
    7: 50,
    8: 60,
};

export const globalDailyQuests: Record<number, GlobalDailyQuest> = Object.fromEntries(
    [
        // Ardenweald
        new GlobalDailyQuest(
            60381,
            ItemQuality.Rare,
            'Aiding Ardenweald',
            null,
            'Complete 3 World Quests',
        ),
        new GlobalDailyQuest(
            60388,
            ItemQuality.Rare,
            'Training in Ardenweald',
            null,
            'Complete 3 World Quests',
        ),
        new GlobalDailyQuest(60419, ItemQuality.Epic, 'A Call to Ardenweald', null, 'Fill the bar'),
        new GlobalDailyQuest(
            60438,
            ItemQuality.Epic,
            'Challenges in Ardenweald',
            null,
            'Complete a dungeon or the Terrors in Tirna Scithe world quest',
        ),

        // Bastion
        new GlobalDailyQuest(
            60392,
            ItemQuality.Rare,
            'Aiding Bastion',
            null,
            'Complete 3 World Quests',
        ),
        new GlobalDailyQuest(
            60404,
            ItemQuality.Rare,
            'Training in Bastion',
            null,
            'Complete 3 World Quests',
        ),
        new GlobalDailyQuest(60425, ItemQuality.Epic, 'A Call to Bastion', null, 'Fill the bar'),
        new GlobalDailyQuest(
            60442,
            ItemQuality.Epic,
            'Challenges in Bastion',
            null,
            'Complete a dungeon or the Disloyal Denizens world quest',
        ),

        // Maldraxxus
        new GlobalDailyQuest(
            60396,
            ItemQuality.Rare,
            'Aiding Maldraxxus',
            null,
            'Complete 3 World Quests',
        ),
        new GlobalDailyQuest(
            60408,
            ItemQuality.Rare,
            'Training in Maldraxxus',
            null,
            'Complete 3 World Quests',
        ),
        new GlobalDailyQuest(60429, ItemQuality.Epic, 'A Call to Maldraxxus', null, 'Fill the bar'),
        new GlobalDailyQuest(
            60445,
            ItemQuality.Epic,
            'Challenges in Maldraxxus',
            null,
            'Complete a dungeon or the Chosen Champions world quest',
        ),

        // Revendreth
        new GlobalDailyQuest(
            60399,
            ItemQuality.Rare,
            'Aiding Revendreth',
            null,
            'Complete 3 World Quests',
        ),
        new GlobalDailyQuest(
            60410,
            ItemQuality.Rare,
            'Training in Revendreth',
            null,
            'Complete 3 World Quests',
        ),
        new GlobalDailyQuest(60432, ItemQuality.Epic, 'A Call to Revendreth', null, 'Fill the bar'),
        new GlobalDailyQuest(
            60448,
            ItemQuality.Epic,
            'Challenges in Revendreth',
            null,
            'Complete a dungeon or the Destroy the Dominant world quest',
        ),

        // Misc
        new GlobalDailyQuest(
            60458,
            ItemQuality.Rare,
            'Anima Salvage',
            null,
            'Gather 150 Anima Embers from Torghast',
        ),
        new GlobalDailyQuest(
            60415,
            ItemQuality.Rare,
            'Rare Resources',
            null,
            'Collect 3 Coins of Brokerage from rares/treasures',
        ),
        new GlobalDailyQuest(
            60454,
            ItemQuality.Epic,
            'Storm the Maw',
            null,
            'Kill 3 rare or special encounter bosses in The Maw',
        ),

        // Battle for Azeroth
        new GlobalDailyQuest(
            50562,
            ItemQuality.Common,
            'Champions of Azeroth',
            null,
            'Complete 4 world quests',
        ),
        new GlobalDailyQuest(
            50604,
            ItemQuality.Common,
            'Tortollan Seekers',
            null,
            'Complete 3 world quests',
        ),

        new GlobalDailyQuest(
            50598,
            ItemQuality.Common,
            'Proudmoore Admiralty',
            'Zandalari Empire',
            'Complete 4 world quests',
        ),
        new GlobalDailyQuest(
            50602,
            ItemQuality.Common,
            "Storm's Wake",
            "Talanji's Expedition",
            'Complete 4 world quests',
        ),
        new GlobalDailyQuest(
            50603,
            ItemQuality.Common,
            'Order of Embers',
            "Vol'dunai",
            'Complete 4 world quests',
        ),
        new GlobalDailyQuest(
            50606,
            ItemQuality.Common,
            'Alliance War Effort',
            'Horde War Efffort',
            'Complete 4 world quests',
        ),

        new GlobalDailyQuest(
            56120,
            ItemQuality.Common,
            'The Waveblade Ankoan',
            'The Unshackled',
            'Complete 4 world quests',
        ),

        // Legion
        new GlobalDailyQuest(
            42170,
            ItemQuality.Common,
            'The Dreamweavers',
            null,
            'Complete 4 world quests',
        ),
        new GlobalDailyQuest(
            42233,
            ItemQuality.Common,
            'Highmountain Tribes',
            null,
            'Complete 4 world quests',
        ),
        new GlobalDailyQuest(
            42234,
            ItemQuality.Common,
            'The Valarjar',
            null,
            'Complete 4 world quests',
        ),
        new GlobalDailyQuest(
            42420,
            ItemQuality.Common,
            'Court of Farondis',
            null,
            'Complete 4 world quests',
        ),
        new GlobalDailyQuest(
            42421,
            ItemQuality.Common,
            'The Nightfallen',
            null,
            'Complete 4 world quests',
        ),
        new GlobalDailyQuest(
            42422,
            ItemQuality.Common,
            'The Wardens',
            null,
            'Complete 4 world quests',
        ),
        new GlobalDailyQuest(
            43179,
            ItemQuality.Common,
            'The Kirin Tor',
            null,
            'Complete 3 world quests',
        ),

        new GlobalDailyQuest(
            48639,
            ItemQuality.Common,
            'Army of the Light',
            null,
            'Complete 4 world quests',
        ),
        new GlobalDailyQuest(
            48641,
            ItemQuality.Common,
            'Armies of Legionfall',
            null,
            'Complete 4 world quests',
        ),
        new GlobalDailyQuest(
            48642,
            ItemQuality.Common,
            'Argussian Reach',
            null,
            'Complete 4 world quests',
        ),
    ].map((gdq) => [gdq.id, gdq]),
);

export const questToLockout: Record<number, number> = {
    47461: 100001, // Lord Kazzak
    47462: 100002, // Azuregos
    47463: 100003, // Dragon of Nightmare
    60214: 100017, // Doomwalker
};
