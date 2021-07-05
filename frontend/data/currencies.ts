import type {Dictionary} from '@/types'

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

export const skipCurrencies: Dictionary<boolean> = {
    // Shadowlands
    1743: true, // Fake Anima for Quest Tracking
    1802: true, // Shadowlands PvP Weekly Reward Progress
    1811: true, // zzoldSanctum Architect
    1812: true, // zzoldSanctum Anima Weaver
    1829: true, // Renown-Kyrian
    1830: true, // Renown-Venthyr
    1831: true, // Renown-Night Fae
    1832: true, // Renown-Necrolord
    1859: true, // Reservoir Anima-Kyrian
    1860: true, // Reservoir Anima-Venthyr
    1861: true, // Reservoir Anima-Night Fae
    1862: true, // Reservoir Anima-Necrolord
    1863: true, // Redeemed Soul-Kyrian
    1864: true, // Redeemed Soul-Venthyr
    1865: true, // Redeemed Soul-Night Fae
    1866: true, // Redeemed Soul-Necrolord
    1867: true, // Sanctum Architect-Kyrian
    1868: true, // Sanctum Architect-Venthyr
    1869: true, // Sanctum Architect-Night Fae
    1870: true, // Sanctum Architect-Necrolord
    1871: true, // Sanctum Anima Weaver-Kyrian
    1872: true, // Sanctum Anima Weaver-Venthyr
    1873: true, // Sanctum Anima Weaver-Night Fae
    1874: true, // Sanctum Anima Weaver-Necrolord

    // Miscellaneous
    2: true, // Currency Token Test Token 2
    1: true, // Currency Token Test Token 4
    4: true, // Currency Token Test Token 5
    1836: true, // Linked Currency Test (Dst) - PTH
    1835: true, // Linked Currency Test (Src) - PTH

    // Player vs. Player
    104: true, // Honor Points DEPRECATED
    181: true, // Honor Points DEPRECATED2

    // Legion
    1355: true, // Felessence

    // Warlords of Draenor
    897: true, // UNUSED

    // Shadowlands
    1754: true, // Argent Commendation??
}
