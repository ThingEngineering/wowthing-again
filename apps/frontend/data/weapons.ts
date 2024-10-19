import { WeaponSubclass } from '@/enums/weapon-subclass';

export const weaponSubclassToString: Record<number, string> = {
    [WeaponSubclass.OneHandedAxe]: '1h Axe',
    [WeaponSubclass.OneHandedMace]: '1h Mace',
    [WeaponSubclass.OneHandedSword]: '1h Sword',
    [WeaponSubclass.Dagger]: 'Dagger',
    [WeaponSubclass.Fist]: 'Fist',
    [WeaponSubclass.Warglaive]: 'Warglaive',
    [WeaponSubclass.Wand]: 'Wand',

    [WeaponSubclass.TwoHandedAxe]: '2h Axe',
    [WeaponSubclass.TwoHandedMace]: '2h Mace',
    [WeaponSubclass.TwoHandedSword]: '2h Sword',
    [WeaponSubclass.Polearm]: 'Polearm',
    [WeaponSubclass.Stave]: 'Stave',

    [WeaponSubclass.Bow]: 'Bow',
    [WeaponSubclass.Crossbow]: 'Crossbow',
    [WeaponSubclass.Gun]: 'Gun',
    [WeaponSubclass.Thrown]: 'Thrown',

    [WeaponSubclass.FishingPole]: 'Fishing Pole',

    [WeaponSubclass.HeldInOffHand]: 'Off-hand',
    [WeaponSubclass.Shield]: 'Shield',
};

export const weaponSubclassOrder: number[] = [
    WeaponSubclass.OneHandedAxe,
    WeaponSubclass.OneHandedMace,
    WeaponSubclass.OneHandedSword,
    WeaponSubclass.Dagger,
    WeaponSubclass.Fist,
    WeaponSubclass.Warglaive,
    WeaponSubclass.TwoHandedAxe,
    WeaponSubclass.TwoHandedMace,
    WeaponSubclass.TwoHandedSword,
    WeaponSubclass.Polearm,
    WeaponSubclass.Stave,
    WeaponSubclass.Bow,
    WeaponSubclass.Crossbow,
    WeaponSubclass.Gun,
    WeaponSubclass.Wand,
    WeaponSubclass.HeldInOffHand,
    WeaponSubclass.Shield,
];

export const weaponSubclassOrderMap: Record<number, number> = Object.fromEntries(
    weaponSubclassOrder.map((type, index) => [type, index]),
);
