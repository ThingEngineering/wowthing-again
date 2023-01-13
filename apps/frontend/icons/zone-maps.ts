import { FarmType } from '@/enums'


export const farmTypeIcons: Record<number, string> = {
    [FarmType.Achievement]: 'gameAchievement',
    // [FarmType.Dungeon]: faDungeon,
    // [FarmType.Event]: mdiTimerSand,
    // [FarmType.EventBig]: mdiTimerSand,
    // [FarmType.Kill]: mdiSkull,
    [FarmType.KillBig]: 'gameCrownedSkull',
    // [FarmType.Profession]: mdiHammerWrench,
    // [FarmType.Puzzle]: mdiPuzzle,
    // [FarmType.Quest]: hisExclamationCircle,
    // [FarmType.Raid]: faDungeon,
    [FarmType.Treasure]: 'gameLockedChest',
    [FarmType.Vendor]: 'mdiCart',

    // [FarmType.Cloth]: mdiLetterC,
    // [FarmType.Leather]: mdiLetterL,
    // [FarmType.Mail]: mdiLetterM,
    // [FarmType.Plate]: mdiLetterP,
    // [FarmType.Weapon]: mdiAxeBattle,
}
