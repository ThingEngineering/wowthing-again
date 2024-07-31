import type { IconifyIcon } from '@iconify/types'

import * as iconLibrary from '../library'
import { WeaponSubclass } from '@/enums/weapon-subclass'


export const weaponSubclassIcons: Record<WeaponSubclass, IconifyIcon> = {
    [WeaponSubclass.OneHandedAxe]: iconLibrary.gameHatchet,
    [WeaponSubclass.OneHandedMace]: iconLibrary.gameThorHammer,
    [WeaponSubclass.OneHandedSword]: iconLibrary.gameGladius,
    [WeaponSubclass.TwoHandedAxe]: iconLibrary.gameBattleAxe,
    [WeaponSubclass.TwoHandedMace]: iconLibrary.gameWoodClub,
    [WeaponSubclass.TwoHandedSword]: iconLibrary.gameBroadsword,
    [WeaponSubclass.Polearm]: iconLibrary.gameTrident,
    [WeaponSubclass.Stave]: iconLibrary.gameWizardStaff,
    [WeaponSubclass.Dagger]: iconLibrary.gameCurvyKnife,
    [WeaponSubclass.Fist]: iconLibrary.gameBrassKnuckles,
    [WeaponSubclass.Warglaive]: iconLibrary.gameBatLeth,
    [WeaponSubclass.Bow]: iconLibrary.gamePocketBow,
    [WeaponSubclass.Crossbow]: iconLibrary.gameCrossbow,
    [WeaponSubclass.Gun]: iconLibrary.gameBlunderbuss,
    [WeaponSubclass.Thrown]: null,
    [WeaponSubclass.Wand]: iconLibrary.gameFairyWand,
    [WeaponSubclass.FishingPole]: null,
    [WeaponSubclass.HeldInOffHand]: iconLibrary.gameSecretBook,
    [WeaponSubclass.Shield]: iconLibrary.gameShield,
    [WeaponSubclass.Miscellaneous]: iconLibrary.mdiProgressQuestion,
}
