export enum PlayableClass {
    DeathKnight = 6,
    DemonHunter = 12,
    Druid = 11,
    Evoker = 13,
    Hunter = 3,
    Mage = 8,
    Monk = 10,
    Paladin = 2,
    Priest = 5,
    Rogue = 4,
    Shaman = 7,
    Warlock = 9,
    Warrior = 1,
}

export enum PlayableClassMask {
    DeathKnight = 2 ** (PlayableClass.DeathKnight - 1),
    DemonHunter = 2 ** (PlayableClass.DemonHunter - 1),
    Druid = 2 ** (PlayableClass.Druid - 1),
    Evoker = 2 ** (PlayableClass.Evoker - 1),
    Hunter = 2 ** (PlayableClass.Hunter - 1),
    Mage = 2 ** (PlayableClass.Mage - 1),
    Monk = 2 ** (PlayableClass.Monk - 1),
    Paladin = 2 ** (PlayableClass.Paladin - 1),
    Priest = 2 ** (PlayableClass.Priest - 1),
    Rogue = 2 ** (PlayableClass.Rogue - 1),
    Shaman = 2 ** (PlayableClass.Shaman - 1),
    Warlock = 2 ** (PlayableClass.Warlock - 1),
    Warrior = 2 ** (PlayableClass.Warrior - 1),
}

export const playableClasses: [string, number][] = Object.entries(PlayableClassMask)
    .filter(([a,]) => isNaN(parseInt(a)))
    .map(([a, b]) => [a, <number>b])
