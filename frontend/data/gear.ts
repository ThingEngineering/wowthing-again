const sepulcherSetItems: [string, number[]][] = [
    ['Head', [
        188868, 188892, 188889, // Dreadful Helm Module (Death Knight, Demon Hunter, Warlock)
        188847, 188859, 188844, // Mystic Helm Module (Druid, Hunter, Mage)
        188933, 188880, 188923, // Venerated Helm Module (Paladin, Priest, Shaman)
        188910, 188901, 188942, // Zenith Helm Module (Monk, Rogue, Warrior)
    ]],
    ['Shoulders', [
        188867, 188896, 188888, // Dreadful Shoulder Module (Death Knight, Demon Hunter, Warlock)
        188851, 188856, 188843, // Mystic Shoulder Module (Druid, Hunter, Mage)
        188932, 188879, 188920, // Venerated Shoulder Module (Paladin, Priest, Shaman)
        188914, 188905, 188941, // Zenith Shoulder Module (Monk, Rogue, Warrior)
    ]],
    ['Chest', [
        188864, 188894, 188884, // Dreadful Chest Module (Death Knight, Demon Hunter, Warlock)
        188849, 188858, 188839, // Mystic Chest Module (Druid, Hunter, Mage)
        188929, 188875, 188922, // Venerated Chest Module (Paladin, Priest, Shaman)
        188912, 188903, 188938, // Zenith Chest Module (Monk, Rogue, Warrior)
    ]],
    ['Hands', [
        188863, 188898, 188890, // Dreadful Hand Module (Death Knight, Demon Hunter, Warlock)
        188853, 188861, 188845, // Mystic Hand Module (Druid, Hunter, Mage)
        188928, 188881, 188925, // Venerated Hand Module (Paladin, Priest, Shaman)
        188916, 188907, 188937, // Zenith Hand Module (Monk, Rogue, Warrior)
    ]],
    ['Legs', [
        188866, 188893, 188887, // Dreadful Leg Module (Death Knight, Demon Hunter, Warlock)
        188848, 188860, 188842, // Mystic Leg Module (Druid, Hunter, Mage)
        188931, 188878, 188924, // Venerated Leg Module (Paladin, Priest, Shaman)
        188911, 188902, 188940, // Zenith Leg Module (Monk, Rogue, Warrior)
    ]],
]

export const currentSetItems = sepulcherSetItems

export const currentSetLookup: Record<number, string> = {}
for (const [slot, itemIds] of currentSetItems) {
    for (const itemId of itemIds) {
        currentSetLookup[itemId] = slot
    }
}
