export const categoryOrder: number[] = [
    245, // Shadowlands
    22, // Dungeon and Raid
    1, // Miscellaneous
    2, // Player vs. Player
    143, // Battle for Azeroth
    141, // Legion
    137, // Warlords of Draenor
    133, // Mists of Pandaria
    81, // Cataclysm
    21, // Wrath of the Lich King
    23, // Burning Crusade
    //4, // Classic
]

const skipCurrencies: number[] = [
    // Shadowlands
    1743, // Fake Anima for Quest Tracking
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

    // Miscellaneous
    2, // Currency Token Test Token 2
    1, // Currency Token Test Token 4
    4, // Currency Token Test Token 5
    1836, // Linked Currency Test (Dst) - PTH
    1835, // Linked Currency Test (Src) - PTH

    // Player vs. Player
    104, // Honor Points DEPRECATED
    181, // Honor Points DEPRECATED2

    // Legion
    1355, // Felessence

    // Warlords of Draenor
    897, // UNUSED

    // Shadowlands
    1754, // Argent Commendation??
]

export const skipCurrenciesMap: Record<number, boolean> = Object.fromEntries(
    skipCurrencies.map((currencyId) => [currencyId, true])
)
