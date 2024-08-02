import { ArmorType } from '@/enums/armor-type';
import { PlayableClass, PlayableClassMask } from '@/enums/playable-class';
import { toIndexRecord } from '@/utils/to-index-record';

export const characterClassBySlug: Record<string, PlayableClass> = {
    'death-knight': PlayableClass.DeathKnight,
    'demon-hunter': PlayableClass.DemonHunter,
    druid: PlayableClass.Druid,
    evoker: PlayableClass.Evoker,
    hunter: PlayableClass.Hunter,
    mage: PlayableClass.Mage,
    monk: PlayableClass.Monk,
    paladin: PlayableClass.Paladin,
    priest: PlayableClass.Priest,
    rogue: PlayableClass.Rogue,
    shaman: PlayableClass.Shaman,
    warlock: PlayableClass.Warlock,
    warrior: PlayableClass.Warrior,
};

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
];

export const classMaskOrder: number[] = [
    PlayableClassMask.Mage,
    PlayableClassMask.Priest,
    PlayableClassMask.Warlock,

    PlayableClassMask.DemonHunter,
    PlayableClassMask.Druid,
    PlayableClassMask.Monk,
    PlayableClassMask.Rogue,

    PlayableClassMask.Evoker,
    PlayableClassMask.Hunter,
    PlayableClassMask.Shaman,

    PlayableClassMask.DeathKnight,
    PlayableClassMask.Paladin,
    PlayableClassMask.Warrior,
];

export const classOrderMap = toIndexRecord(classOrder);
export const classMaskOrderMap = toIndexRecord(classMaskOrder);

export const classByArmorType: Record<number, PlayableClass[]> = {
    [ArmorType.Cloth]: [PlayableClass.Mage, PlayableClass.Priest, PlayableClass.Warlock],
    [ArmorType.Leather]: [
        PlayableClass.DemonHunter,
        PlayableClass.Druid,
        PlayableClass.Monk,
        PlayableClass.Rogue,
    ],
    [ArmorType.Mail]: [PlayableClass.Evoker, PlayableClass.Hunter, PlayableClass.Shaman],
    [ArmorType.Plate]: [PlayableClass.DeathKnight, PlayableClass.Paladin, PlayableClass.Warrior],
};

export const classByArmorTypeString: Record<string, PlayableClass[]> = Object.fromEntries(
    Object.entries(classByArmorType).map(([armorType, classes]) => [
        ArmorType[parseInt(armorType)].toLowerCase(),
        classes,
    ]),
);

export const classIdToArmorType: Record<number, ArmorType> = Object.fromEntries(
    Object.entries(classByArmorType)
        .map(([armorType, classIds]) => classIds.map((classId) => [classId, parseInt(armorType)]))
        .flat(),
);
