import { Holiday } from '@/enums/holiday';
import { Profession } from '@/enums/profession';
import type { Task } from '@/types/tasks';

export const eventDarkmoonFaire: Task = {
    key: 'eventDarkmoonFaire',
    name: '[Event] Darkmoon Faire',
    shortName: 'DMF',
    minimumLevel: 1,
    requiredHolidays: [Holiday.DarkmoonFaire],
    chores: [
        {
            key: 'dmfStrength',
            name: 'Test Your Strength',
        },
        {
            key: 'dmfDenmother',
            name: 'Kill Moonfang',
        },
        // Items
        {
            key: 'dmfStrategist',
            name: '{itemWithIcon:71715}', // A Treatise on Strategy
        },
        {
            key: 'dmfBanner',
            name: '{itemWithIcon:71951}', // Banner of the Fallen
        },
        {
            key: 'dmfInsignia',
            name: '{itemWithIcon:71952}', // Captured Insignia
        },
        {
            key: 'dmfJournal',
            name: '{itemWithIcon:71953}', // Fallen Adventurer's Journal
        },
        {
            key: 'dmfCrystal',
            name: '{itemWithIcon:71635}', // Imbued Crystal
        },
        {
            key: 'dmfEgg',
            name: '{itemWithIcon:71636}', // Monstrous Egg
        },
        {
            key: 'dmfGrimoire',
            name: '{itemWithIcon:71637}', // Mysterious Grimoire
        },
        {
            key: 'dmfWeapon',
            name: '{itemWithIcon:71638}', // Ornate Weapon
        },
        {
            key: 'dmfDivination',
            name: '{itemWithIcon:71716}', // Soothsayer's Runes
        },
        // Professions
        {
            key: 'dmfAlchemy',
            name: ':alchemy: A Fizzy Fusion',
            couldGetFunc: (char) => !!char.professions?.[Profession.Alchemy],
        },
        {
            key: 'dmfBlacksmithing',
            name: ':blacksmithing: Baby Needs Two Pair of Shoes',
            couldGetFunc: (char) => !!char.professions?.[Profession.Blacksmithing],
        },
        {
            key: 'dmfEnchanting',
            name: ':enchanting: Putting Trash to Good Use',
            couldGetFunc: (char) => !!char.professions?.[Profession.Enchanting],
        },
        {
            key: 'dmfEngineering',
            name: ":engineering: Talkin' Tonks",
            couldGetFunc: (char) => !!char.professions?.[Profession.Engineering],
        },
        {
            key: 'dmfHerbalism',
            name: ':herbalism: Herbs for Healing',
            couldGetFunc: (char) => !!char.professions?.[Profession.Herbalism],
        },
        {
            key: 'dmfInscription',
            name: ':inscription: Writing the Future',
            couldGetFunc: (char) => !!char.professions?.[Profession.Inscription],
        },
        {
            key: 'dmfJewelcrafting',
            name: ':jewelcrafting: Keeping the Faire Sparkling',
            couldGetFunc: (char) => !!char.professions?.[Profession.Jewelcrafting],
        },
        {
            key: 'dmfLeatherworking',
            name: ':leatherworking: Eyes on the Prizes',
            couldGetFunc: (char) => !!char.professions?.[Profession.Leatherworking],
        },
        {
            key: 'dmfMining',
            name: ':mining: Rearm, Reuse, Recycle',
            couldGetFunc: (char) => !!char.professions?.[Profession.Mining],
        },
        {
            key: 'dmfSkinning',
            name: ':skinning: Tan My Hide',
            couldGetFunc: (char) => !!char.professions?.[Profession.Skinning],
        },
        {
            key: 'dmfTailoring',
            name: ':tailoring: Banners, Banners Everywhere!',
            couldGetFunc: (char) => !!char.professions?.[Profession.Tailoring],
        },
        {
            key: 'dmfArchaeology',
            name: ':archaeology: Fun for the Little Ones',
            couldGetFunc: (char) => !!char.professions?.[Profession.Archaeology],
        },
        {
            key: 'dmfCooking',
            name: ':cooking: Putting the Crunch in the Frog',
            couldGetFunc: (char) => !!char.professions?.[Profession.Cooking],
        },
        {
            key: 'dmfFishing',
            name: ":fishing: Spoilin' for Salty Sea Dogs",
            couldGetFunc: (char) => !!char.professions?.[Profession.Fishing],
        },
    ],
};
