import { PlayableClass } from '@/enums/playable-class';

export const artifactsByClass: Record<number, number[]> = {
    [PlayableClass.DeathKnight]: [
        128402, // Maw of the Damned [Blood]
        128292, // Blades of the Fallen Prince MH [Frost]
        128403, // Apocalypse [Unholy]
    ],
    [PlayableClass.DemonHunter]: [
        127829, // Twinblades of the Deceiver MH [Havoc]
        128832, // Aldrachi Warblades [Vengeance]
    ],
    [PlayableClass.Druid]: [
        128858, // Scythe of Elune [Balance]
        128860, // Fangs of Ashamane [Feral]
        128821, // Claws of Ursoc [Guardian]
        128306, // G'Hanir, the Mother Tree [Restoration]
    ],
    [PlayableClass.Hunter]: [
        128861, // Titanstrike [Beast Mastery]
        128826, // Thas'dorah, Legacy of the Windrunners [Marksmanship]
        128808, // Talonclaw [Survival]
    ],
    [PlayableClass.Mage]: [
        127857, // Aluneth [Arcane]
        128820, // Felo'melorn [Fire]
        128862, // Ebonchill [Frost]
    ],
    [PlayableClass.Monk]: [
        128938, // Fu Zan, the Wanderer's Companion [Brewmaster]
        128937, // Sheilun, Staff of the Mists [Mistweaver]
        128940, // Fists of the Heavens MH [Windwalker]
    ],
    [PlayableClass.Paladin]: [
        128823, // The Silver Hand [Holy]
        128866, // Truthguard [Protection]
        120978, // Ashbringer [Retribution]
    ],
    [PlayableClass.Priest]: [
        128868, // Light's Wrath [Discipline]
        128825, // T'uure, Beacon of the Naaru [Holy]
        128827, // Xal'atath, Blade of the Black Empire [Shadow]
    ],
    [PlayableClass.Rogue]: [
        128870, // The Kingslayers MH [Assassination]
        128872, // The Dreadblades MH [Outlaw]
        128476, // Fangs of the Devourer MH [Subtlety]
    ],
    [PlayableClass.Shaman]: [
        128935, // The Fist of Ra-den [Elemental]
        128819, // Doomhammer [Enhancement]
        128911, // Sharas'dal, Scepter of Tides [Restoration]
    ],
    [PlayableClass.Warlock]: [
        128942, // Ulthalesh, the Deadwind Harvester [Affliction]
        128943, // Skull of the Man'ari [Demonology]
        128941, // Scepter of Sargeras [Destruction]
    ],
    [PlayableClass.Warrior]: [
        128910, // Strom'kar, the Warbreaker [Arms]
        128908, // Warswords of the Valarjar MH [Fury]
        128289, // Scale of the Earth-Warder [Protection]
    ],
};

export const appearanceSetPrefix = ['Base', 'Upgr', ' BoP', ' PvP', 'Mage', 'Hide'];

export const progressAchievements: Record<string, [number, number, string?, number?]> = {
    '4-1': [11657, 1, "defeat Kil'jaeden"],
    '4-2': [11661, 10, 'RBGs won'],
    '4-3': [11665, 10, 'different Legion dungeons'],
    '5-1': [11152, 30, 'Legion dungeons'],
    '5-2': [11153, 200, 'world quests'],
    '5-3': [11154, 1000, 'PvP kills'],
};
export const unlockText: Record<string, string> = {
    '0-1': "Recover Light's Heart",
    '0-2': 'Recover a Pillar of Creation',
    '0-3': 'Complete your first order campaign',
    '1-3': 'This Side Up achievement, hope you like archaeology',
    '2-0': 'Balance of Power quest line',
    '2-1': 'Unleashed Monstrosities achievement',
    '2-2': 'Mythic +5 timed?',
    '2-3': 'Glory of the Legion Hero achievement',
    '3-0': 'Honor level 10',
    '3-1': 'Honor level 30',
    '3-2': 'Honor level 50',
    '3-3': 'Honor level 80',
    '4-0': 'UNAVAILABLE! Mage Tower',
    '5-0': 'Hidden appearance, look it up on Wowhead',
};
