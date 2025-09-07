import { Holiday } from '@/enums/holiday';
import { Profession } from '@/enums/profession';
import { DbResetType } from '@/shared/stores/db/enums';
import { userStore } from '@/stores';
import type { Chore, Task } from '@/types/tasks';

const customExpiryFunc: Chore['customExpiryFunc'] = (char, scannedAt) => {
    const scannedPeriod = userStore.getPeriodForCharacter2(scannedAt, char);
    return scannedPeriod.endTime.plus({ days: 3 });
};

export const eventDarkmoonFaire: Task = {
    key: 'eventDarkmoonFaire',
    name: '[Event] Darkmoon Faire',
    shortName: 'DMF',
    minimumLevel: 1,
    requiredHolidays: [Holiday.DarkmoonFaire],
    chores: [
        {
            key: 'battleJeremy',
            name: 'Pet Battle: Jeremy Feasel',
            accountWide: true,
            questIds: [32175],
            questReset: DbResetType.Daily,
        },
        {
            key: 'battleChristoph',
            name: 'Pet Battle: Christoph VonFeasel',
            accountWide: true,
            questIds: [36471],
            questReset: DbResetType.Daily,
        },
        {
            key: 'dmfStrength',
            name: 'Test Your Strength',
            questIds: [29433],
            questReset: DbResetType.Custom,
            customExpiryFunc,
        },
        {
            key: 'dmfDenmother',
            name: 'Kill Moonfang',
            questIds: [33354],
            questReset: DbResetType.Custom,
            customExpiryFunc,
        },
        null,
        // Items
        {
            key: 'dmfStrategist',
            name: '{itemWithIcon:71715}', // A Treatise on Strategy
            questIds: [29451],
            questReset: DbResetType.Custom,
            customExpiryFunc,
        },
        {
            key: 'dmfBanner',
            name: '{itemWithIcon:71951}', // Banner of the Fallen
            questIds: [29456],
            questReset: DbResetType.Custom,
            customExpiryFunc,
        },
        {
            key: 'dmfInsignia',
            name: '{itemWithIcon:71952}', // Captured Insignia
            questIds: [29457],
            questReset: DbResetType.Custom,
            customExpiryFunc,
        },
        {
            key: 'dmfJournal',
            name: '{itemWithIcon:71953}', // Fallen Adventurer's Journal
            questIds: [29458],
            questReset: DbResetType.Custom,
            customExpiryFunc,
        },
        {
            key: 'dmfCrystal',
            name: '{itemWithIcon:71635}', // Imbued Crystal
            questIds: [29443],
            questReset: DbResetType.Custom,
            customExpiryFunc,
        },
        {
            key: 'dmfEgg',
            name: '{itemWithIcon:71636}', // Monstrous Egg
            questIds: [29444],
            questReset: DbResetType.Custom,
            customExpiryFunc,
        },
        {
            key: 'dmfGrimoire',
            name: '{itemWithIcon:71637}', // Mysterious Grimoire
            questIds: [29445],
            questReset: DbResetType.Custom,
            customExpiryFunc,
        },
        {
            key: 'dmfWeapon',
            name: '{itemWithIcon:71638}', // Ornate Weapon
            questIds: [29446],
            questReset: DbResetType.Custom,
            customExpiryFunc,
        },
        {
            key: 'dmfDivination',
            name: '{itemWithIcon:71716}', // Soothsayer's Runes
            questIds: [29464],
            questReset: DbResetType.Custom,
            customExpiryFunc,
        },
        null,
        // Professions
        {
            key: 'dmfAlchemy',
            name: ':alchemy: A Fizzy Fusion',
            questIds: [29506],
            questReset: DbResetType.Custom,
            customExpiryFunc,
            couldGetFunc: (char) => !!char.professions?.[Profession.Alchemy],
        },
        {
            key: 'dmfBlacksmithing',
            name: ':blacksmithing: Baby Needs Two Pair of Shoes',
            questIds: [29508],
            questReset: DbResetType.Custom,
            customExpiryFunc,
            couldGetFunc: (char) => !!char.professions?.[Profession.Blacksmithing],
        },
        {
            key: 'dmfEnchanting',
            name: ':enchanting: Putting Trash to Good Use',
            questIds: [29510],
            questReset: DbResetType.Custom,
            customExpiryFunc,
            couldGetFunc: (char) => !!char.professions?.[Profession.Enchanting],
        },
        {
            key: 'dmfEngineering',
            name: ":engineering: Talkin' Tonks",
            questIds: [29511],
            questReset: DbResetType.Custom,
            customExpiryFunc,
            couldGetFunc: (char) => !!char.professions?.[Profession.Engineering],
        },
        {
            key: 'dmfHerbalism',
            name: ':herbalism: Herbs for Healing',
            questIds: [29514],
            questReset: DbResetType.Custom,
            customExpiryFunc,
            couldGetFunc: (char) => !!char.professions?.[Profession.Herbalism],
        },
        {
            key: 'dmfInscription',
            name: ':inscription: Writing the Future',
            questIds: [29515],
            questReset: DbResetType.Custom,
            customExpiryFunc,
            couldGetFunc: (char) => !!char.professions?.[Profession.Inscription],
        },
        {
            key: 'dmfJewelcrafting',
            name: ':jewelcrafting: Keeping the Faire Sparkling',
            questIds: [29516],
            questReset: DbResetType.Custom,
            customExpiryFunc,
            couldGetFunc: (char) => !!char.professions?.[Profession.Jewelcrafting],
        },
        {
            key: 'dmfLeatherworking',
            name: ':leatherworking: Eyes on the Prizes',
            questIds: [29517],
            questReset: DbResetType.Custom,
            customExpiryFunc,
            couldGetFunc: (char) => !!char.professions?.[Profession.Leatherworking],
        },
        {
            key: 'dmfMining',
            name: ':mining: Rearm, Reuse, Recycle',
            questIds: [29518],
            questReset: DbResetType.Custom,
            customExpiryFunc,
            couldGetFunc: (char) => !!char.professions?.[Profession.Mining],
        },
        {
            key: 'dmfSkinning',
            name: ':skinning: Tan My Hide',
            questIds: [29519],
            questReset: DbResetType.Custom,
            customExpiryFunc,
            couldGetFunc: (char) => !!char.professions?.[Profession.Skinning],
        },
        {
            key: 'dmfTailoring',
            name: ':tailoring: Banners, Banners Everywhere!',
            questIds: [29520],
            questReset: DbResetType.Custom,
            customExpiryFunc,
            couldGetFunc: (char) => !!char.professions?.[Profession.Tailoring],
        },
        {
            key: 'dmfArchaeology',
            name: ':archaeology: Fun for the Little Ones',
            questIds: [29507],
            questReset: DbResetType.Custom,
            customExpiryFunc,
            couldGetFunc: (char) => !!char.professions?.[Profession.Archaeology],
        },
        {
            key: 'dmfCooking',
            name: ':cooking: Putting the Crunch in the Frog',
            questIds: [29509],
            questReset: DbResetType.Custom,
            customExpiryFunc,
            couldGetFunc: (char) => !!char.professions?.[Profession.Cooking],
        },
        {
            key: 'dmfFishing',
            name: ":fishing: Spoilin' for Salty Sea Dogs",
            questIds: [29513],
            questReset: DbResetType.Custom,
            customExpiryFunc,
            couldGetFunc: (char) => !!char.professions?.[Profession.Fishing],
        },
    ],
};
