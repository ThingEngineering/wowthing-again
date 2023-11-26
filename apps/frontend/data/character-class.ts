import flatten from 'lodash/flatten'

import { ArmorType } from '@/enums/armor-type'
import { PlayableClass } from '@/enums/playable-class'
import { toIndexRecord } from '@/utils/to-index-record'


export const classOrder: number[] = [
    PlayableClass.Mage,
    PlayableClass.Priest,
    PlayableClass.Warlock,

    PlayableClass.DemonHunter,
    PlayableClass.Druid,
    PlayableClass.Monk,
    PlayableClass.Rogue,

    PlayableClass.Evoker,
    PlayableClass.Hunter,
    PlayableClass.Shaman,

    PlayableClass.DeathKnight,
    PlayableClass.Paladin,
    PlayableClass.Warrior,
]

export const classOrderMap = toIndexRecord(classOrder)

export const classByArmorType: Record<number, PlayableClass[]> = {
    [ArmorType.Cloth]: [
        PlayableClass.Mage,
        PlayableClass.Priest,
        PlayableClass.Warlock,
    ],
    [ArmorType.Leather]: [
        PlayableClass.DemonHunter,
        PlayableClass.Druid,
        PlayableClass.Monk,
        PlayableClass.Rogue,
    ],
    [ArmorType.Mail]: [
        PlayableClass.Evoker,
        PlayableClass.Hunter,
        PlayableClass.Shaman,
    ],
    [ArmorType.Plate]: [
        PlayableClass.DeathKnight,
        PlayableClass.Paladin,
        PlayableClass.Warrior,
    ],
}

export const classByArmorTypeString: Record<string, PlayableClass[]> = Object.fromEntries(
    Object.entries(classByArmorType)
        .map(
            ([armorType, classes]) => [
                ArmorType[parseInt(armorType)].toLowerCase(),
                classes,
            ]
        )
)

export const classIdToArmorType: Record<number, ArmorType> = Object.fromEntries(
    flatten(
        Object.entries(classByArmorType)
            .map(([armorType, classIds]) => classIds.map((classId) => [classId, parseInt(armorType)]))
    )
)
