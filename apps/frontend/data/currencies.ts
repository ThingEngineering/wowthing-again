import type { StaticDataCurrencyCategory } from '@/stores/static/types'


export const categoryOrder: number[] = [
    250, // Dragonflight
    245, // Shadowlands
    143, // Battle for Azeroth
    141, // Legion
    137, // Warlords of Draenor
    133, // Mists of Pandaria
    81, // Cataclysm
    21, // Wrath of the Lich King
    23, // Burning Crusade
    //4, // Classic
    0, // separator
    22, // Dungeon and Raid
    1, // Miscellaneous
    2, // Player vs. Player
]

export const categoryChildren: Record<number, StaticDataCurrencyCategory[]> = {
    // Miscellaneous
    1: [
        {
            id: 100101,
            name: 'World Events',
            slug: 'world-events',
        }
    ],

    // Dragonflight
    250: [
        {
            id: 125001,
            name: 'Crafting Knowledge',
            slug: 'crafting-knowledge',
        },
        {
            id: 125002,
            name: 'Crafting Materials',
            slug: 'crafting-materials',
        },
        {
            id: 125011,
            name: 'Season 1',
            slug: 'season-1',
        },
        {
            id: 125012,
            name: 'Season 2',
            slug: 'season-2',
        },
    ],
}

export const currencyExtra: Record<number, number[]> = {
    // Dragonflight
    250: [
        // 1191, // Valor
        // 2167, // Catalyst Charges
    ],
    // Dragonflight - Crafting Knowledge
    125001: [
        2023, // Blacksmithing Knowledge
        2024, // Alchemy Knowledge
        2025, // Leatherworking Knowledge
        2026, // Tailoring Knowledge
        2027, // Engineering Knowledge
        2028, // Inscription Knowledge
        2029, // Jewelcrafting Knowledge
        2030, // Enchanting Knowledge
        2033, // Skinning Knowledge
        2034, // Herbalism Knowledge
        2035, // Mining Knowledge
    ],
    // Dragonflight - Season 2
    125012: [
        2245, // Flightstones
        2533, // Renascent Shadowflame
    ],
}

export const currencyItems: Record<number, number[]> = {
    // Burning Crusade
    23: [
        26045, // Halaa Battle Token
        26044, // Halaa Research Token
    ],

    // Warlords of Draenor
    137: [
        124099, // Blackfang Claw
    ],

    // Legion
    141: [
        124124, // Blood of Sargeras
        146963, // Desecrated Seaweed
        153021, // Intact Demon Eye
    ],

    // Battle for Azeroth
    143: [
        152668, // Expulsom
        162460, // Hydrocore
        165948, // Tidalcore
        168802, // Nazjatar Battle Commendation
    ],

    // Shadowlands
    245: [
        188957, // Genesis Mote
        190189, // Sandworn Relic
    ],

    // Dragonflight
    250: [
        204276, // Untapped Forbidden Knowledge
        null,
        202196, // Zskera Vault Key
        null,
        204715, // Unearthed Fragrant Coin
        204727, // Coveted Bauble
        204985, // Barter Brick
        205188, // Barter Boulder
        null,
        207030, // Dilated Time Capsule
        207002, // Encapsulated Destiny
    ],
    // Dragonflight > Crafting Knowledge
    125001: [
        191784, // Dragon Shard of Knowledge [DF]
    ],
    // Dragonflight > Crafting Materials
    125002: [
        198048, // Titan Training Matrix I
        198056, // Titan Training Matrix II
        198058, // Titan Training Matrix III
        198059, // Titan Training Matrix IV
        204673, // Titan Training Matrix V
        null,
        190456, // Artisan's Mettle
    ],
    // Dragonflight > Season 1
    125011: [
        201836, // Aspects' Token of Merit
        199197, // Bottled Essence
        190453, // Spark of Ingenuity
        null,
        200686, // Primal Focus
        197921, // Primal Infusion
        190455, // Concentrated Primal Focus
        198046, // Concentrated Primal Infusion
    ],
    // Dragonflight > Season 2
    125012: [
        205225, // Aspects' Token of Merit
        204717, // Splintered Spark of Shadowflame
        204440, // Spark of Shadowflame
        null,
        204075, // Whelpling's Shadowflame Crest Fragment
        204193, // Whelpling's Shadowflame Crest
        204076, // Drake's Shadowflame Crest Fragment
        204195, // Drake's Shadowflame Crest
        204077, // Wyrm's Shadowflame Crest Fragment
        204196, // Wyrm's Shadowflame Crest
        204078, // Aspect's Shadowflame Crest Fragment
        204194, // Aspect's Shadowflame Crest
        null,
        204681, // Enchanted Whelpling's Shadowflame Crest
        204682, // Enchanted Wyrm's Shadowflame Crest
        204697, // Enchanted Aspect's Shadowflame Crest
    ],

    // Player vs Player
    2: [
        137642, // Mark of Honor
    ],

    // Miscellaneous
    1: [
        163036, // Polished Pet Charm
        116415, // Shiny Pet Charm
    ],

    // Miscellaneous > World Events
    100101: [
        37829, // Brewfest Prize Token
        23247, // Burning Blossom
        21100, // Coin of Ancestry
        49927, // Love Token
        44791, // Noblegarden Chocolate
        33226, // Tricky Treat
    ],
}

export const currencyItemCurrencies: Record<number, number> = {
    204075: 2409, // Whelpling Crest Fragment
    204076: 2410, // Drake Crest Fragment
    204077: 2411, // Wyrm Crest Fragment
    204078: 2412, // Aspect Crest Fragment
}

const skipCurrencies: number[] = [
    // Warlords of Draenor
    897, // UNUSED

    // Legion
    1355, // Felessence
    1356, // Echoes of Battle
    1357, // Echoes of Domination

    // Battle for Azeroth
    1587, // War Supplies

    // Shadowlands
    1743, // Fake Anima for Quest Tracking
    1754, // Argent Commendation??
    1802, // Shadowlands PvP Weekly Reward Progress
    1811, // zzoldSanctum Architect
    1812, // zzoldSanctum Anima Weaver
    1829, // Renown-Kyrian
    1830, // Renown-Venthyr
    1831, // Renown-Night Fae
    1832, // Renown-Necrolord
    1859, // Reservoir Anima-Kyrian
    1860, // Reservoir Anima-Venthyr
    1861, // Reservoir Anima-Night Fae
    1862, // Reservoir Anima-Necrolord
    1863, // Redeemed Soul-Kyrian
    1864, // Redeemed Soul-Venthyr
    1865, // Redeemed Soul-Night Fae
    1866, // Redeemed Soul-Necrolord
    1867, // Sanctum Architect-Kyrian
    1868, // Sanctum Architect-Venthyr
    1869, // Sanctum Architect-Night Fae
    1870, // Sanctum Architect-Necrolord
    1871, // Sanctum Anima Weaver-Kyrian
    1872, // Sanctum Anima Weaver-Venthyr
    1873, // Sanctum Anima Weaver-Night Fae
    1874, // Sanctum Anima Weaver-Necrolord

    // Dragonflight
    2045, // Dragon Glyph Embers
    2073, // [AC] Major Faction Test Currency

    // Miscellaneous
    1, // Currency Token Test Token 4
    2, // Currency Token Test Token 2
    4, // Currency Token Test Token 5
    42, // Badge of Justice
    1388, // Armor Scraps
    1835, // Linked Currency Test (Src) - PTH
    1836, // Linked Currency Test (Dst) - PTH
    2005, // Druid Talent Points (DNT)
    2006, // Restoration Talent Points (DNT)
    2011, // Effigy Adornments
    2012, // Death Knight Talent Points (DNT)
    2013, // Frost Talent Points (DNT)
    2014, // Unholy Talent Points (DNT)
    2015, // Blood Talent Points (DNT)
    2032, // Trader's Tender

    // Player vs. Player
    103, // Arena Points
    104, // Honor Points DEPRECATED
    161, // Stone Keeper's Shard
    181, // Honor Points DEPRECATED2
    201, // Venture Coin
]

export const skipCurrenciesMap: Record<number, boolean> = Object.fromEntries(
    skipCurrencies.map((currencyId) => [currencyId, true])
)
