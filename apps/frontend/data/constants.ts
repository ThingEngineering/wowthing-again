export abstract class Constants {
    static readonly characterMaxLevel: number = 70
    static readonly expansion: number = 9
    static readonly maxRenown: number = 80
    static readonly restedDuration: number = 10 * 24 * 60 * 60 // 10 days
    
    static readonly mythicPlusSeason: number = 11

    static readonly currencies = {
        catalyst: 2796, // Renascent Dream
        dragonridingPassengers: 2133,
        valor: 1191,
    }

    static readonly reputations = {
        artisansConsortium: 2544,
        loammNiffen: 2564,
    }

    static readonly seasonItemBonusListGroups = [305, 306, 307, 308, 309, 310]

    static readonly upgradeTiers = {
        explorer: 970,
        adventurer: 971,
        veteran: 972,
        champion: 973,
        hero: 974,
        myth: 978,
    }

    static readonly icons = {
        alliance: 'achievement/13467', // Tides of Vengeance
        horde: 'achievement/13466', // Tides of Vengeance

        anniversary: 'item/71134', // Celebration Package
        chromieTime: 'spell/96794', // Time Warp
        dragonridingPassengers: 'spell/372610', // Skyward Ascent
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
    }
}
