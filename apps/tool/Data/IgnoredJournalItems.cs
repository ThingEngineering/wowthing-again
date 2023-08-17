namespace Wowthing.Tool.Data;

public static partial class Hardcoded
{
    public static readonly HashSet<int> IgnoredJournalItems = new()
    {
        // WotLK > Ulduar
        // TODO remove these if Blizzard ever fixes the broken loot
        // Hodir hard mode
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
        // Thorim hard mode
        45470, // Wisdom's Hold
        45472, // Warhelm of the Champion
        45473, // Embrace of the Gladiator
        45474, // Pauldrons of the Combatant
        45570, // Skyforge Crossbow
        45928, // Gauntlets of the Thunder Lord
        45930, // Combatant's Bootblade
        // Freya hard mode
        45294, // Petrified Ivy Sprig
        45484, // Bladetwister
        45485, // Bronze Pendant of the Vanir
        45486, // Drape of the Sullen Goddess
        45487, // Handguards of Revitalization
        45488, // Leggings of the Enslaved Idol
        45613, // Dreambinder
        45943, // Gloves of Whispering Winds
        45947, // Serilas, Blood Blade of Invar One-Arm

        56376, // Thundercall (now 133251)
        120163, // Thruk's Fishing Rod
        178708, // Unbound Changeling??
    };
}
