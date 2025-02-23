import type { JournalDataTier } from '@/types/data';

export const extraTiers: JournalDataTier[] = [
    {
        id: 1000001,
        name: 'Dungeons',
        slug: 'dungeons',
        instances: [],
        subTiers: [],
    },
    {
        id: 1000002,
        name: 'Raids',
        slug: 'raids',
        instances: [],
        subTiers: [],
    },
    {
        id: 1000099,
        name: 'World Bosses',
        slug: 'world-bosses',
        instances: [],
    },
];

export const hardModeItemIds = new Set<number>([
    // Sartharion 10
    43988, // Gale-Proof Cloak [1]
    43989, // Remembrance Girdle [1]
    43990, // Blade-Scarred Tunic [1]
    43991, // Legguards of Composure [1]
    43994, // Belabored Legplates [2]
    43995, // Enamored Cowl [2]
    43996, // Sabatons of Firmament [2]
    43998, // Chestguard of Flagrant Prowess [2]
    43986, // Black Drake [3]
    // Sartharion 25
    44000, // Dragonstorm Breastplate [1]
    44002, // The Sanctum's Flowing Vestments [1]
    44003, // Upstanding Spaulders [1]
    44004, // Bountiful Gauntlets [1]
    44005, // Pennant Cloak [2]
    44006, // Obsidian Greathelm [2]
    44007, // Headpiece of Reconciliation [2]
    44008, // Unsullied Cuffs [2]
    44011, // Leggings of the Honored [2]
    43954, // Twilight Drake [3]

    // Flame Leviathan
    45132, // Golden Saronite Dragon
    45134, // Plated Leggings of Ruination
    45135, // Boots of Fiery Resolution
    45136, // Shoulderpads of Dormant Energies
    45293, // Handguards of Potent Cures
    45295, // Gilded Steel Legplates
    45300, // Mantle of Fiery Vengeance
    // XT-002 Deconstructor
    45442, // Sorthalis, Hammer of the Watchers
    45444, // Gloves of the Steady Hand
    45445, // Breastplate of the Devoted
    45446, // Grasps of Reason
    45867, // Breastplate of the Stoneshaper
    45868, // Aesir's Edge
    45869, // Fluxing Energy Coils
    45870, // Magnetized Projectile Emitter
    // Assembly of Iron
    45245, // Shoulderpads of the Intruder
    45448, // Perilous Bite
    45449, // The Masticator
    45455, // Belt of the Crystal Tree
    45242, // Drape of Mortal Downfall
    45241, // Belt of Colossal Rage
    45244, // Greaves of Swift Vengeance
    45607, // Fang of Oblivion
    // Hodir
    45457, // Staff of Endless Winter
    45460, // Bindings of Winter Gale
    45461, // Drape of Icy Intent
    45462, // Gloves of the Frozen Glade
    45612, // Constellus
    45876, // Shiver
    45877, // The Boreal Guard
    45886, // Icecore Staff
    45887, // Ice Layered Barrier
    45888, // Bitter Cold Armguards
    // Thorim
    45470, // Wisdom's Hold
    45472, // Warhelm of the Champion
    45473, // Embrace of the Gladiator
    45474, // Pauldrons of the Combatant
    45570, // Skyforge Crossbow
    45928, // Gauntlets of the Thunder Lord
    45930, // Combatant's Bootblade
    // Freya
    45294, // Petrified Ivy Sprig
    45484, // Bladetwister
    45486, // Drape of the Sullen Goddess
    45487, // Handguards of Revitalization
    45488, // Leggings of the Enslaved Idol
    45613, // Dreambinder
    45943, // Gloves of Whispering Winds
    45947, // Serilas, Blood Blade of Invar One-Arm
    // Mimiron
    45494, // Delirium's Touch
    45496, // Titanskin Cloak
    45497, // Crown of Luminescence
    45620, // Starshard Edge
    45663, // Armbands of Bedlam
    45982, // Fused Alloy Legplates
    45988, // Greaves of the Iron Army
    45989, // Tempered Mercury Greaves
    45990, // Fusion Blade
    45993, // Mimiron's Flight Goggles
    // General Vezax
    45516, // Voidrethar, Dark Blade of Oblivion
    45519, // Vestments of the Blind Denizen
    45520, // Handwraps of the Vigilant
    46033, // Tortured Earth
    46035, // Aesuga, Hand of the Argent Champion
    46036, // Void Sabre
    46032, // Drape of the Faceless General
    46034, // Leggings of Profound Darkness
    // Yogg-Saron
    45533, // Dark Edge of Depravity
    45536, // Legguards of Cunning Deception
    45537, // Treads of the False Oracle
    46067, // Hammer of Crushing Whispers
    46068, // Amice of Inconceivable Horror
    46095, // Soul-Devouring Cinch
    46097, // Caress of Insanity

    // Operation: Mechagon > King Mechagon
    168830, // Aerial Unit R-21/X [mount]
]);
