import sortBy from 'lodash/sortBy';

import { Profession } from '@/enums/profession';
import { toIndexRecord } from '@/utils/to-index-record';
import type { TaskProfession } from '@/types/data';

import { dragonflightAlchemy, midnightAlchemy, warWithinAlchemy } from './alchemy';
import {
    dragonflightBlacksmithing,
    midnightBlacksmithing,
    warWithinBlacksmithing,
} from './blacksmithing';
import { dragonflightCooking } from './cooking';
import { dragonflightEnchanting, midnightEnchanting, warWithinEnchanting } from './enchanting';
import { dragonflightEngineering, midnightEngineering, warWithinEngineering } from './engineering';
import { dragonflightFishing } from './fishing';
import { dragonflightHerbalism, midnightHerbalism, warWithinHerbalism } from './herbalism';
import { dragonflightInscription, midnightInscription, warWithinInscription } from './inscription';
import {
    dragonflightJewelcrafting,
    midnightJewelcrafting,
    warWithinJewelcrafting,
} from './jewelcrafting';
import {
    dragonflightLeatherworking,
    midnightLeatherworking,
    warWithinLeatherworking,
} from './leatherworking';
import { dragonflightMining, midnightMining, warWithinMining } from './mining';
import { dragonflightSkinning, midnightSkinning, warWithinSkinning } from './skinning';
import { dragonflightTailoring, midnightTailoring, warWithinTailoring } from './tailoring';

export const professionIdToSlug: Record<number, string> = {
    [Profession.Alchemy]: 'alchemy',
    [Profession.Blacksmithing]: 'blacksmithing',
    [Profession.Enchanting]: 'enchanting',
    [Profession.Engineering]: 'engineering',
    [Profession.Herbalism]: 'herbalism',
    [Profession.Inscription]: 'inscription',
    [Profession.Jewelcrafting]: 'jewelcrafting',
    [Profession.Leatherworking]: 'leatherworking',
    [Profession.Mining]: 'mining',
    [Profession.Skinning]: 'skinning',
    [Profession.Tailoring]: 'tailoring',

    [Profession.Archaeology]: 'archaeology',
    [Profession.Cooking]: 'cooking',
    [Profession.Fishing]: 'fishing',
};

export const isGatheringProfession: Record<number, boolean> = {
    182: true, // Herbalism
    186: true, // Mining
    393: true, // Skinning
};
export const isSecondaryProfession: Record<number, boolean> = {
    794: true, // Archaeology
    185: true, // Cooking
    356: true, // Fishing
};
export const isCraftingProfession: Record<number, boolean> = Object.fromEntries(
    Object.keys(professionIdToSlug)
        .map((id) => parseInt(id))
        .filter((id) => !isGatheringProfession[id] && !isSecondaryProfession[id])
        .map((id) => [id, true])
);
// I hate that object keys are always strings, ugh
export const professionOrder: number[] = sortBy(Object.entries(professionIdToSlug), ([id, slug]) =>
    [
        isSecondaryProfession[parseInt(id)] ? 2 : isGatheringProfession[parseInt(id)] ? 1 : 0,
        slug,
    ].join('|')
).map(([id]) => parseInt(id));

export const professionOrderMap = toIndexRecord(professionOrder);

export const professionSpecializationToSpell: Record<string, number> = {
    // Alchemy
    'Elixir Master': 28677,
    'Potion Master': 28675,
    'Transmutation Master': 28672,
    // Engineering
    'Gnomish Engineer': 20219,
    'Goblin Engineer': 20222,
};

export const professionSpecializationSpells: Record<number, string> = Object.fromEntries(
    Object.entries(professionSpecializationToSpell).map(([spellName, spellId]) => [
        spellId,
        spellName,
    ])
);

export const darkmoonFaireProfessionQuests: Record<number, number> = {
    171: 29506, // Alchemy - A Fizzy Fusion
    164: 29508, // Blacksmithing - Baby Needs Two Pair of Shoes
    333: 29510, // Enchanting - Putting Trash to Good Use
    202: 29511, // Engineering - Talkin' Tonks
    182: 29514, // Herbalism - Herbs for Healing
    773: 29515, // Inscription - Writing the Future
    755: 29516, // Jewelcrafting - Keeping the Faire Sparkling
    165: 29517, // Leatherworking - Eyes on the Prizes
    186: 29518, // Mining - Rearm, Reuse, Recycle
    393: 29519, // Skinning - Tan My Hide
    197: 29520, // Tailoring - Banners, Banners Everywhere!

    794: 29507, // Archaeology - Fun for the Little Ones
    185: 29509, // Cooking - Putting the Crunch in the Frog
    356: 29513, // Fishing - Spoilin' for Salty Sea Dogs
};

export const dragonflightProfessions: TaskProfession[] = [
    dragonflightAlchemy,
    dragonflightBlacksmithing,
    dragonflightEnchanting,
    dragonflightEngineering,
    dragonflightInscription,
    dragonflightJewelcrafting,
    dragonflightLeatherworking,
    dragonflightTailoring,

    dragonflightHerbalism,
    dragonflightMining,
    dragonflightSkinning,

    dragonflightCooking,
    dragonflightFishing,
];

export const dragonflightProfessionMap: Record<number, TaskProfession> = Object.fromEntries(
    dragonflightProfessions.map((profession) => [profession.id, profession])
);

export const warWithinProfessions: TaskProfession[] = [
    warWithinAlchemy,
    warWithinBlacksmithing,
    warWithinEnchanting,
    warWithinEngineering,
    warWithinInscription,
    warWithinJewelcrafting,
    warWithinLeatherworking,
    warWithinTailoring,

    warWithinHerbalism,
    warWithinMining,
    warWithinSkinning,
];

export const warWithinProfessionMap: Record<number, TaskProfession> = Object.fromEntries(
    warWithinProfessions.map((profession) => [profession.id, profession])
);

export const midnightProfessions: TaskProfession[] = [
    midnightAlchemy,
    midnightBlacksmithing,
    midnightEnchanting,
    midnightEngineering,
    midnightInscription,
    midnightJewelcrafting,
    midnightLeatherworking,
    midnightTailoring,

    midnightHerbalism,
    midnightMining,
    midnightSkinning,
];

export const midnightProfessionMap: Record<number, TaskProfession> = Object.fromEntries(
    midnightProfessions.map((profession) => [profession.id, profession])
);
