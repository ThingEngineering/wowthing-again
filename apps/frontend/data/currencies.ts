import { imageStrings } from './icons';
import { Profession } from '@/enums/profession';
import type { StaticDataCurrencyCategory } from '@/shared/stores/static/types';

export const categoryOrder: number[] = [
    260, // War Within
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
];

export const categoryChildren: Record<number, StaticDataCurrencyCategory[]> = {
    // Miscellaneous
    1: [
        {
            id: 100101,
            name: 'Pet Battles',
            slug: 'pet-battles',
        },
        {
            id: 100102,
            name: 'World Events',
            slug: 'world-events',
        },
        {
            id: 100103,
            name: 'Timerunning',
            slug: 'timerunning',
        },
    ],

    // The War Within
    260: [
        {
            id: 126001,
            name: 'Crafting Concentration',
            slug: 'crafting-concentration',
        },
        {
            id: 126002,
            name: 'Crafting Knowledge',
            slug: 'crafting-knowledge',
        },
        {
            id: 126011,
            name: 'Season 1',
            slug: 'season-1',
        },
        {
            id: 126012,
            name: 'Season 2',
            slug: 'season-2',
        },
        {
            id: 126013,
            name: 'Season 3',
            slug: 'season-3',
        },
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
        {
            id: 125013,
            name: 'Season 3',
            slug: 'season-3',
        },
        {
            id: 125014,
            name: 'Season 4',
            slug: 'season-4',
        },
    ],
};

export const currencyExtra: Record<number, number[]> = {
    // The War Within - Crafting Concentration
    126001: [
        3045, // Alchemy
        3040, // Blacksmithing
        3046, // Enchanting
        3044, // Engineering
        3043, // Inscription
        3013, // Jewelcrafting
        3042, // Leatherworking
        3041, // Tailoring
    ],
    // The War Within - Crafting Knowledge
    126002: [
        2785, // Alchemy Knowledge
        2786, // Blacksmithing Knowledge
        2787, // Enchanting Knowledge
        2788, // Engineering Knowledge
        2789, // Herbalism Knowledge
        2790, // Inscription Knowledge
        2791, // Jewelcrafting Knowledge
        2792, // Leatherworking Knowledge
        2793, // Mining Knowledge
        2794, // Skinning Knowledge
        2795, // Tailoring Knowledge
    ],
    // The War Within - Season 1
    126011: [
        2813, // Harmonized Silk
    ],
    // The War Within - Season 2
    126012: [
        3116, // Essence of Kaja'mite
    ],
    // The War Within - Season 3
    126013: [
        3269, // Ethereal Voidsplinter
        2803, // Undercoins
        3008, // Valorstones
        3284, // Weathered Ethereal Crest
        3286, // Carved Ethereal Crest
        3288, // Runed Ethereal Crest
        3290, // Gilded Ethereal Crest
        3028, // Restored Coffer Key
    ],

    // Dragonflight
    250: [
        // 1191, // Valor
        // 2167, // Catalyst Charges
    ],
    // Dragonflight - Crafting Knowledge
    125001: [
        2024, // Alchemy Knowledge
        2023, // Blacksmithing Knowledge
        2030, // Enchanting Knowledge
        2027, // Engineering Knowledge
        2034, // Herbalism Knowledge
        2028, // Inscription Knowledge
        2029, // Jewelcrafting Knowledge
        2025, // Leatherworking Knowledge
        2035, // Mining Knowledge
        2033, // Skinning Knowledge
        2026, // Tailoring Knowledge
    ],
    // Dragonflight - Season 2
    125012: [
        2533, // Renascent Shadowflame
    ],
    // Dragonflight - Season 3
    125013: [
        2796, // Renascent Dream
        2797, // Trophy of Strife
        null,
        2706, // Whelpling's Dreaming Crests
        2707, // Drake's Dreaming Crests
        2708, // Wyrm's Dreaming Crests
        2709, // Aspect's Dreaming Crests
    ],
    // Dragonflight - Season 4
    125014: [
        2245, // Flightstones
        2912, // Renascent Awakening
        null,
        2806, // Whelpling's Awakened Crest
        2807, // Drake's Awakened Crest
        2809, // Wyrm's Awakened Crest
        2812, // Aspect's Awakened Crest
    ],
    // Miscellaneous > World Events
    100102: [
        3309, // Hellstone Shard
    ],
    // Miscellaneous > Timerunning
    100103: [
        3252, // Bronze
        3268, // Infinite Power
        3292, // Infinite Knowledge
        null,
        3293, // Epoch Memento
        3251, // Felforged Bronze
    ],
};

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
        211376, // Seedbloom
        208066, // Small Dreamseed
        208067, // Plump Dreamseed
        208047, // Gigantic Dreamseed
        null,
        207026, // Dreamsurge Coalescence
        210254, // Dreamsurge Cocoon
        null,
        209856, // Dilated Time Pod
        207002, // Encapsulated Destiny
        null,
        204715, // Unearthed Fragrant Coin
        204727, // Coveted Bauble
        204985, // Barter Brick
        205188, // Barter Boulder
        null,
        204276, // Untapped Forbidden Knowledge
        202196, // Zskera Vault Key
    ],
    // Dragonflight > Crafting Knowledge
    125001: [
        191784, // Dragon Shard of Knowledge [DF]
    ],
    // Dragonflight > Crafting Materials
    125002: [
        190456, // Artisan's Mettle
        198048, // Titan Training Matrix I
        198056, // Titan Training Matrix II
        198058, // Titan Training Matrix III
        198059, // Titan Training Matrix IV
        204673, // Titan Training Matrix V
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
        204717, // Splintered Spark of Shadowflame
        204440, // Spark of Shadowflame
        205225, // Aspects' Token of Merit
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
    // Dragonflight > Season 3
    125013: [
        208396, // Splintered Spark of Dreams
        206959, // Spark of Dreams
    ],
    // Dragonflight > Season 4
    125014: [
        211515, // Splintered Spark of Awakening
        211516, // Spark of Awakening
        213089, // Antique Bronze Bullion
    ],

    // The War Within
    260: [
        210814, // Artisan's Acuity
        223951, // Earth-Encrusted Gem
        212493, // Odd Glob of Wax
        206350, // Radiant Remnant
        null,
        233246, // Gunk-Covered Thingy
        234741, // Miscellaneous Mechanica
        238920, // Radiant Emblem of Service
        null,
        237502, // Puzzling Cartel Chip
        244465, // Titan Disc Shards
    ],
    // The War Within - Season 1
    126011: [
        211297, // Fractured Spark of Omens
        211296, // Spark of Omens
        224069, // Enchanted Weathered Harbinger Crest
        224072, // Enchanted Runed Harbinger Crest
        224073, // Enchanted Gilded Harbinger Crest
    ],
    // The War Within - Season 2
    126012: [
        237578, // Counterfeit Dealer's Chip
        230905, // Fractured Spark of Fortunes
        230906, // Spark of Fortunes
        230937, // Enchanted Weathered Undermine Crest
        230936, // Enchanted Runed Undermine Crest
        230935, // Enchanted Gilded Undermine Crest
    ],
    // The War Within - Season 3
    126013: [
        245653, // Coffer Key Shard
        246771, // Radiant Echo
        248242, // Algari Token of Merit
        231757, // Fractured Spark of Starlight
        231756, // Spark of Starlight
        231767, // Enchanted Weathered Ethereal Crest
        231769, // Enchanted Runed Ethereal Crest
        231768, // Enchanted Gilded Ethereal Crest
    ],

    // Player vs Player
    2: [
        137642, // Mark of Honor
    ],

    // Miscellaneous
    // 1: [],
    // Miscellaneous > Pet Battles
    100101: [
        86143, // Battle Pet Bandage
        98112, // Lesser Pet Treat
        98114, // Pet Treat
        163036, // Polished Pet Charm
        null,
        92741, // Flawless Battle-Stone
        98715, // Marked Flawless Battle-Stone
        92679, // Flawless Aquatic Battle-Stone
        92675, // Flawless Beast Battle-Stone
        92676, // Flawless Critter Battle-Stone
        92683, // Flawless Dragonkin Battle-Stone
        92665, // Flawless Elemental Battle-Stone
        92677, // Flawless Flying Battle-Stone
        92682, // Flawless Humanoid Battle-Stone
        92678, // Flawless Magic Battle-Stone
        92680, // Flawless Mechanical Battle-Stone
        92681, // Flawless Undead Battle-Stone
        null,
        122457, // Ultimate Battle-Training Stone
        127755, // Fel-Touched Battle-Training Stone
        116424, // Aquatic Battle-Training Stone
        116374, // Beast Battle-Training Stone
        116418, // Critter Battle-Training Stone
        116419, // Dragonkin Battle-Training Stone
        116420, // Elemental Battle-Training Stone
        116421, // Flying Battle-Training Stone
        116416, // Humanoid Battle-Training Stone
        116422, // Magic Battle-Training Stone
        116417, // Mechanical Battle-Training Stone
        116423, // Undead Battle-Training Stone
    ],
    // Miscellaneous > World Events
    100102: [
        37829, // Brewfest Prize Token
        23247, // Burning Blossom
        21100, // Coin of Ancestry
        49927, // Love Token
        44791, // Noblegarden Chocolate
        33226, // Tricky Treat
        null,
        231510, // Timewarped Relic Coffer Key [LFR]
        232365, // Timewarped Relic Coffer Key [Normal]
        232366, // Timewarped Relic Coffer Key [Heroic]
    ],
};

export const currencyItemCurrencies: Record<number, number> = {
    204075: 2409, // Whelpling Crest Fragment
    204076: 2410, // Drake Crest Fragment
    204077: 2411, // Wyrm Crest Fragment
    204078: 2412, // Aspect Crest Fragment

    213089: 3010, // Antique Bronze Bullion

    211297: 3023, // Fractured Spark of Omens
    230905: 3132, // Fractured Spark of Fortunes

    231510: 3144, // Timewarped Relic Coffer Key [LFR]
    232365: 3145, // Timewarped Relic Coffer Key [N]
    232366: 3146, // Timewarped Relic Coffer Key [H]
};

export const currencyProfession: Record<number, number> = {
    3045: Profession.Alchemy,
    3040: Profession.Blacksmithing,
    3046: Profession.Enchanting,
    3044: Profession.Engineering,
    3043: Profession.Inscription,
    3013: Profession.Jewelcrafting,
    3042: Profession.Leatherworking,
    3041: Profession.Tailoring,
};

export const currencyIconOverride: Record<number, string> = {
    // The War Within - Concentration
    3045: imageStrings['alchemy'],
    3040: imageStrings['blacksmithing'],
    3046: imageStrings['enchanting'],
    3044: imageStrings['engineering'],
    3043: imageStrings['inscription'],
    3013: imageStrings['jewelcrafting'],
    3042: imageStrings['leatherworking'],
    3041: imageStrings['tailoring'],
};

const skipCurrencies: number[] = [
    // The War Within
    2914, // Weathered Harbinger Crest
    2915, // Carved Harbinger Crest
    2916, // Runed Harbinger Crest
    2917, // Gilded Harbinger Crest

    // Dragonflight
    2651, // Seedbloom
    2706, // Whelpling's Dreaming Crests
    2707, // Drake's Dreaming Crests
    2708, // Wyrm's Dreaming Crests
    2709, // Aspect's Dreaming Crests
    2806, // Whelpling's Awakened Crest
    2807, // Drake's Awakened Crest
    2809, // Wyrm's Awakened Crest
    2812, // Aspect's Awakened Crest

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
];

export const skipCurrenciesMap: Record<number, boolean> = Object.fromEntries(
    skipCurrencies.map((currencyId) => [currencyId, true])
);

export const pvpCurrencies = new Set<number>([
    1356, // Echoes of Battle
    1602, // Conquest
    1792, // Honor
    2123, // Bloody Tokens
    1137642, // Mark of Honor
]);
