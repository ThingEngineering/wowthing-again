import { WeaponSubclass } from '@/types/enums/weapon-subclass'


export const weaponSubclassToString: Record<number, string> = {
    [WeaponSubclass.OneHandedAxe]: '1h axe',
    [WeaponSubclass.OneHandedMace]: '1h mace',
    [WeaponSubclass.OneHandedSword]: '1h sword',
    [WeaponSubclass.Dagger]: 'dagger',
    [WeaponSubclass.Fist]: 'fist',
    [WeaponSubclass.Warglaive]: 'warglaive',
    [WeaponSubclass.Wand]: 'wand',

    [WeaponSubclass.TwoHandedAxe]: '1h axe',
    [WeaponSubclass.TwoHandedMace]: '2h mace',
    [WeaponSubclass.TwoHandedSword]: '2h sword',
    [WeaponSubclass.Polearm]: 'polearm',
    [WeaponSubclass.Stave]: 'stave',

    [WeaponSubclass.Bow]: 'bow',
    [WeaponSubclass.Crossbow]: 'crossbow',
    [WeaponSubclass.Gun]: 'gun',
    [WeaponSubclass.Thrown]: 'thrown',

    [WeaponSubclass.FishingPole]: 'fishing pole',

    [WeaponSubclass.HeldInOffHand]: 'off-hand',
    [WeaponSubclass.Shield]: 'shield',
}
