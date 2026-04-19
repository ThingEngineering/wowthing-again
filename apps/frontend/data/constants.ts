import { DateTime } from 'luxon';

export const MAX_TAGS = 20;
export const MAX_TASKS = 100;
export const MAX_VIEWS = 100;

export abstract class Constants {
    static readonly characterMaxLevel: number = 90;
    static readonly charactersPerAccount: number = 70;
    static readonly expansion: number = 11;
    static readonly guildBankTabItems = 98;
    static readonly maxRenown: number = 80;
    static readonly restedDuration: number = 10 * 24 * 60 * 60; // 10 days

    static readonly mythicPlusSeason: number = 17;

    static readonly defaultUnixTime = 946684800;
    static readonly defaultTime = DateTime.fromSeconds(Constants.defaultUnixTime);

    static readonly remixMythicPlusSeason: number = 1001;

    static readonly currencies = {
        catalyst: 3378, // Dawnlight Manaflux [Mid S1]
        conquest: 1602,
        honor: 1792,
        itemUpgrade: 3008, // Valorstones
    };

    static readonly items = {
        petCage: 82800,
    };

    static readonly reputations = {
        nazjatarFriends: [2377, 2389, 2376, 2388, 2375, 2390],

        artisansConsortium: 2544,
        loammNiffen: 2564,
        delveBrann: 2640,
        delveValeera: 2744,

        midnightAmani: 2696,
        midnightHarati: 2704,
        midnightSingulatity: 2699,
        midnightSilvermoon: 2710,
    };

    // static JSON -> itemBonusListGroups -> match upgradeTiers IDs
    static readonly seasonItemBonusListGroups = new Set<number>([
        607,
        608,
        609,
        610,
        611,
        612, // first set
        613,
        614,
        615,
        616,
        617,
        618, // second set
        619,
        626,
        627,
        628,
        629,
        630, // third set
    ]);

    static readonly upgradeTiers = {
        explorer: 970,
        adventurer: 971,
        veteran: 972,
        champion: 973,
        hero: 974,
        myth: 978,
    };

    static readonly icons = {
        alliance: 'achievement/13467', // Tides of Vengeance
        horde: 'achievement/13466', // Tides of Vengeance

        anniversary: 'item/71134', // Celebration Package
        chromieTime: 'spell/96794', // Time Warp
        enchant: 'spell/7411', // Enchanting
        gem: 'item/12361', // Blue Sapphire
        heirloom: 'item/122338', // Ancient Heirloom Armor Casing
        resting: 'spell/140430', // Passed Out
        torghast: 'spell/334746', // Access to Torghast
        upgrade: 'spell/331516', // Enhance Soulkeeper
        warMode: 'spell/304019', // Conflict and Strife
        weeklyAnima: 'spell/341209', // Overwhelming Anima
        weeklyShapingFate: 'item/186196', // Death's Advance War Chest
        weeklySouls: 'spell/225100', // Charging Station

        armorCloth: 'item/102289',
        armorLeather: 'item/102282',
        armorMail: 'item/102275',
        armorPlate: 'item/102268',
    };
}

export abstract class Strings {
    static readonly doUnlockQuests = 'Do unlock quests!';
}
