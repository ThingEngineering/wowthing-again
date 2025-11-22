import { Constants } from './constants';

// spellId, spellName, expiresWhileOffline
export const durationAuras: [number, string, boolean?][] = [
    // flasks
    [431971, 'Flask of Tempered Aggression'],
    [431972, 'Flask of Tempered Swiftness'],
    [431973, 'Flask of Tempered Versatility'],
    [431974, 'Flask of Tempered Mastery'],
    [432021, 'Flask of Alchemical Chaos'],
    [432403, 'Vicious Flask of Classical Spirits'],
    [432430, 'Vicious Flask of Honor'],
    [432452, 'Vicious Flask of the Wrecking Ball'],
    [432473, 'Flask of Saving Graces'],
    // misc consumables
    [1221184, 'Bottle of Mysterious Wisdom'],
    // ??
    [24705, 'Grim Visage'],
    [26013, 'Deserter', true],
    [29175, 'Ribbon Dance'],
    [42138, 'Brewfest Enthusiast'],
    [46668, 'WHEE!'],
    [71041, 'Dungeon Deserter', true],
    [95987, 'Unburdened'],
    [136583, 'Darkmoon Top Hat', true],
    [289982, 'Draught of Ten Lands'],
    [392960, 'Waygate Travel', true],
    [455050, 'Blessings of the Bronze Dragonflight'],
    [465631, 'Blessings of the Bronze Dragonflight'],
    // timewalking
    [423860, 'Knowledge of Timeways I'],
    [423861, 'Mastery of Timeways I'],
    [471543, 'Knowledge of Timeways II'],
    [471544, 'Mastery of Timeways II'],
    [1229052, 'Knowledge of Timeways III'],
    [1229050, 'Mastery of Timeways III'],
    [1229052, 'Knowledge of Timeways III'],
    [1258528, 'Mastery of Timeways IV'],
];

export const staticAuras: [number, string][] = [
    [Constants.remixLegionSpellId, 'WoW Remix: Legion'],
    [1238465, 'Heroic World Tier'],
    [1246363, "Delver's Bounty"],
];
