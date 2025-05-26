export enum WeaponSubclass {
    OneHandedAxe = 0,
    TwoHandedAxe = 1,
    Bow = 2,
    Gun = 3,
    OneHandedMace = 4,
    TwoHandedMace = 5,
    Polearm = 6,
    OneHandedSword = 7,
    TwoHandedSword = 8,
    Warglaive = 9,
    Staff = 10,
    //11: bear claws?
    //12: cat claws?
    Fist = 13,
    Miscellaneous = 14,
    Dagger = 15,
    Thrown = 16,
    //17: spear?
    Crossbow = 18,
    Wand = 19,
    FishingPole = 20,

    HeldInOffHand = 30,
    Shield = 31,
}

export const offHandWeaponSubclasses: Set<WeaponSubclass> = new Set<WeaponSubclass>([
    WeaponSubclass.HeldInOffHand,
    WeaponSubclass.Shield,
]);

export const oneHandWeaponSubclasses: Set<WeaponSubclass> = new Set<WeaponSubclass>([
    WeaponSubclass.Dagger,
    WeaponSubclass.Fist,
    WeaponSubclass.OneHandedAxe,
    WeaponSubclass.OneHandedMace,
    WeaponSubclass.OneHandedSword,
    WeaponSubclass.Wand,
    WeaponSubclass.Warglaive,
]);

export const twoHandWeaponSubclasses: Set<WeaponSubclass> = new Set<WeaponSubclass>([
    WeaponSubclass.Bow,
    WeaponSubclass.Crossbow,
    WeaponSubclass.Gun,
    WeaponSubclass.Polearm,
    WeaponSubclass.Staff,
    WeaponSubclass.TwoHandedAxe,
    WeaponSubclass.TwoHandedMace,
    WeaponSubclass.TwoHandedSword,
]);
