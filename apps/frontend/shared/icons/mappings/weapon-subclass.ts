import { WeaponSubclass } from '@/enums/weapon-subclass';
import type { Icon } from '@/types/icons';
import * as iconLibrary from '../library';

export const weaponSubclassIcons: Record<number, Icon> = {
    [WeaponSubclass.OneHandedAxe]: iconLibrary.gameHatchet,
    [WeaponSubclass.OneHandedMace]: iconLibrary.gameThorHammer,
    [WeaponSubclass.OneHandedSword]: iconLibrary.gameGladius,
    [WeaponSubclass.TwoHandedAxe]: iconLibrary.gameBattleAxe,
    [WeaponSubclass.TwoHandedMace]: iconLibrary.gameWoodClub,
    [WeaponSubclass.TwoHandedSword]: iconLibrary.gameBroadsword,
    [WeaponSubclass.Polearm]: iconLibrary.gameTrident,
    [WeaponSubclass.Staff]: iconLibrary.gameWizardStaff,
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
};
