import { WeaponSubclass } from '@/enums/weapon-subclass'


export const weaponIcons: Record<WeaponSubclass, string> = {
    [WeaponSubclass.OneHandedAxe]: 'gameHatchet',
    [WeaponSubclass.OneHandedMace]: 'gameThorHammer',
    [WeaponSubclass.OneHandedSword]: 'gameGladius',
    [WeaponSubclass.TwoHandedAxe]: 'gameBattleAxe',
    [WeaponSubclass.TwoHandedMace]: 'gameWoodClub',
    [WeaponSubclass.TwoHandedSword]: 'gameBroadsword',
    [WeaponSubclass.Polearm]: 'gameTrident',
    [WeaponSubclass.Stave]: 'gameWizardStaff',
    [WeaponSubclass.Dagger]: 'gameCurvyKnife',
    [WeaponSubclass.Fist]: 'gameBrassKnuckles',
    [WeaponSubclass.Warglaive]: 'gameBatLeth',
    [WeaponSubclass.Bow]: 'gamePocketBow',
    [WeaponSubclass.Crossbow]: 'gameCrossbow',
    [WeaponSubclass.Gun]: 'gameBlunderbuss',
    [WeaponSubclass.Thrown]: undefined,
    [WeaponSubclass.Wand]: 'gameFairyWand',
    [WeaponSubclass.FishingPole]: undefined,
    [WeaponSubclass.HeldInOffHand]: 'gameSecretBook',
    [WeaponSubclass.Shield]: 'gameShield',
    [WeaponSubclass.Miscellaneous]: 'mdiProgressQuestion',
}
