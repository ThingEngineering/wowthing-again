export abstract class Constants {
    static readonly characterMaxLevel: number = 60
    static readonly maxRenown: number = 80
    static readonly maxTorghastWing: number = 12
    static readonly mythicPlusSeason: number = 6
    static readonly restedDuration: number = 10 * 24 * 60 * 60 // 10 days

    static readonly icons = {
        alliance: 'achievement/13467', // Tides of Vengeance
        horde: 'achievement/13466', // Tides of Vengeance

        enchant: 'spell/7411', // Enchanting
        gem: 'spell/25229', // Jewelcrafting
        resting: 'spell/140430', // Passed Out
        torghast: 'spell/334746', // Access to Torghast
        warMode: 'spell/304019', // Conflict and Strife
        weeklyAnima: 'spell/341209', // Overwhelming Anima
        weeklyShapingFate: 'item/186196', // Death's Advance War Chest
        weeklySouls: 'spell/225100', // Charging Station
    }
}
