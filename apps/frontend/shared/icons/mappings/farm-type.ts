import * as iconLibrary from '../library';
import { FarmType } from '@/enums/farm-type';
import type { Icon } from '@/types/icons';

export const farmTypeIcons: Record<number, Icon> = {
    [FarmType.Achievement]: iconLibrary.gameTrophy,
    [FarmType.Dungeon]: iconLibrary.faDungeon,
    [FarmType.Event]: iconLibrary.mdiTimerSand,
    [FarmType.EventBig]: iconLibrary.mdiTimerSand,
    [FarmType.Kill]: iconLibrary.mdiSkull,
    [FarmType.KillBig]: iconLibrary.gameCrownedSkull,
    [FarmType.Profession]: iconLibrary.mdiHammerWrench,
    [FarmType.Puzzle]: iconLibrary.mdiPuzzle,
    [FarmType.Quest]: iconLibrary.hisExclamationCircle,
    [FarmType.Raid]: iconLibrary.gameCastle,
    [FarmType.Treasure]: iconLibrary.gamePresent,
    [FarmType.Vendor]: iconLibrary.mdiCart,

    [FarmType.Cloth]: iconLibrary.mdiLetterC,
    [FarmType.Leather]: iconLibrary.mdiLetterL,
    [FarmType.Mail]: iconLibrary.mdiLetterM,
    [FarmType.Plate]: iconLibrary.mdiLetterP,
    // [FarmType.Weapon]: mdiAxeBattle,
};
