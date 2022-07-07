import { CharacterClass } from '@/types'
import { PlayableClass } from '@/types/enums'


export const classMap: Record<number, CharacterClass> = {
    1: new CharacterClass(
        1,
        'Warrior',
        'class_warrior',
        [71, 72, 73],
    ),
    2: new CharacterClass(
        2,
        'Paladin',
        'class_paladin',
        [65, 66, 70],
    ),
    3: new CharacterClass(
        3,
        'Hunter',
        'class_hunter',
        [253, 254, 255],
    ),
    4: new CharacterClass(
        4,
        'Rogue',
        'class_rogue',
        [259, 260, 261],
    ),
    5: new CharacterClass(
        5,
        'Priest',
        'class_priest',
        [256, 257, 258],
    ),
    6: new CharacterClass(
        6,
        'Death Knight',
        'class_death_knight',
        [250, 251, 252],
    ),
    7: new CharacterClass(
        7,
        'Shaman',
        'class_shaman',
        [262, 263, 264],
    ),
    8: new CharacterClass(
        8,
        'Mage',
        'class_mage',
        [62, 63, 64],
    ),
    9: new CharacterClass(
        9,
        'Warlock',
        'class_warlock',
        [265, 266, 267],
    ),
    10: new CharacterClass(
        10,
        'Monk',
        'class_monk',
        [268, 269, 270],
    ),
    11: new CharacterClass(
        11,
        'Druid',
        'class_druid',
        [102, 103, 104, 105],
    ),
    12: new CharacterClass(
        12,
        'Demon Hunter',
        'class_demon_hunter',
        [577, 581],
    ),
}

export const classNameMap: Record<string, CharacterClass> = Object.fromEntries(
    Object.entries(classMap)
        .map(([, cls]) => [cls.name, cls]),
)

export const classSlugMap: Record<string, CharacterClass> = Object.fromEntries(
    Object.entries(classMap)
        .map(([, cls]) => [
            cls.name.toLowerCase().replace(' ', '-'),
            cls,
        ]),
)

export const classIdToSlug: Record<number, string> = Object.fromEntries(
    Object.entries(classSlugMap)
        .map(([slug, cls]) => [cls.id, slug])
)

export const classOrder: number[] = [
    PlayableClass.Mage,
    PlayableClass.Priest,
    PlayableClass.Warlock,

    PlayableClass.DemonHunter,
    PlayableClass.Druid,
    PlayableClass.Monk,
    PlayableClass.Rogue,

    PlayableClass.Hunter,
    PlayableClass.Shaman,

    PlayableClass.DeathKnight,
    PlayableClass.Paladin,
    PlayableClass.Warrior,
]
