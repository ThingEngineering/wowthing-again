import type { IconifyIcon } from '@iconify/types'

import gameBatLeth from '@iconify/icons-game-icons/bat-leth'
import gameBattleAxe from '@iconify/icons-game-icons/battle-axe'
import gameBlunderbuss from '@iconify/icons-game-icons/blunderbuss'
import gameBrassKnuckles from '@iconify/icons-game-icons/brass-knuckles'
import gameBroadsword from '@iconify/icons-game-icons/broadsword'
import gameCrossbow from '@iconify/icons-game-icons/crossbow'
import gameCurvyKnife from '@iconify/icons-game-icons/curvy-knife'
import gameFairyWand from '@iconify/icons-game-icons/fairy-wand'
import gameGladius from '@iconify/icons-game-icons/gladius'
import gameHatchet from '@iconify/icons-game-icons/hatchet'
import gamePocketBow from '@iconify/icons-game-icons/pocket-bow'
import gameSecretBook from '@iconify/icons-game-icons/secret-book'
import gameShield from '@iconify/icons-game-icons/shield'
import gameThorHammer from '@iconify/icons-game-icons/thor-hammer'
import gameTrident from '@iconify/icons-game-icons/trident'
import gameWizardStaff from '@iconify/icons-game-icons/wizard-staff'
import gameWoodClub from '@iconify/icons-game-icons/wood-club'

import { WeaponSubclass } from '@/enums'


export const weaponIcons: Record<WeaponSubclass, IconifyIcon> = {
    [WeaponSubclass.OneHandedAxe]: gameHatchet,
    [WeaponSubclass.OneHandedMace]: gameThorHammer,
    [WeaponSubclass.OneHandedSword]: gameGladius,
    [WeaponSubclass.TwoHandedAxe]: gameBattleAxe,
    [WeaponSubclass.TwoHandedMace]: gameWoodClub,
    [WeaponSubclass.TwoHandedSword]: gameBroadsword,
    [WeaponSubclass.Polearm]: gameTrident,
    [WeaponSubclass.Stave]: gameWizardStaff,
    [WeaponSubclass.Dagger]: gameCurvyKnife,
    [WeaponSubclass.Fist]: gameBrassKnuckles,
    [WeaponSubclass.Warglaive]: gameBatLeth,
    [WeaponSubclass.Bow]: gamePocketBow,
    [WeaponSubclass.Crossbow]: gameCrossbow,
    [WeaponSubclass.Gun]: gameBlunderbuss,
    [WeaponSubclass.Thrown]: undefined,
    [WeaponSubclass.Wand]: gameFairyWand,
    [WeaponSubclass.FishingPole]: undefined,
    [WeaponSubclass.HeldInOffHand]: gameSecretBook,
    [WeaponSubclass.Shield]: gameShield,
}
