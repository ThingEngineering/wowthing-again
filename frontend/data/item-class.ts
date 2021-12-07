import { WeaponType } from '@/types/enums'


export const weaponSubclassToType: Record<number, WeaponType> = {
    0: WeaponType.OneHandedAxe,
    1: WeaponType.TwoHandedAxe,
    2: WeaponType.Bow,
    3: WeaponType.Gun,
    4: WeaponType.OneHandedMace,
    5: WeaponType.TwoHandedMace,
    6: WeaponType.Polearm,
    7: WeaponType.OneHandedSword,
    8: WeaponType.TwoHandedSword,
    9: WeaponType.Warglaive,
    10: WeaponType.Stave,
    //11: bear claws?
    //12: cat claws?
    13: WeaponType.Fist,
    //14: misc?
    15: WeaponType.Dagger,
    16: WeaponType.Thrown,
    //17: spear?
    18: WeaponType.Crossbow,
    19: WeaponType.Wand,
    20: WeaponType.FishingPole,
}

export const weaponTypeToSubclass: Record<number, number> = Object.fromEntries(
    Object.entries(weaponSubclassToType)
        .map(([k, v]) => [v, parseInt(k)])
)
