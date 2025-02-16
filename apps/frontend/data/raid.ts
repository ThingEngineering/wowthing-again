// Ulduar, Siege of Orgrimmar and raids released in Warlords of Draenor and Legion
// can be completed multiple times on Normal and Heroic difficulty, although any
// consecutive kills in the same week won't reward any loot.
//
// Every other raid from Vanilla, Burning Crusade, Wrath of the Lich King, Cataclysm
// and Mists of Pandaria can only be completed once a week, due to the raid preventing
// a manual reset from occurring unless it's the Weekly Reset.
//
// https://www.wowhead.com/guide/lockouts-and-resets-in-world-of-warcraft-6072
export const singleLockoutRaids = new Set<number>([
    // Classic
    73, // Blackwing Descent
    741, // Molten Core
    742, // Blackwing Lair
    743, // Ruins of Ahn'Qiraj
    744, // Temple of Ahn'Qiraj
    // TBC
    745, // Karazhan
    746, // Gruul's Lair
    747, // Magtheridon's Lair
    748, // Serpentshrine Cavern
    749, // Tempest Keep
    750, // Mount Hyjal
    751, // Black Temple
    752, // Sunwell
    // WotLK
    753, // Vault of Archavon
    754, // Naxxramas
    755, // Obsidian Sanctum
    756, // Eye of Eternity
    757, // Trial of the Crusader
    758, // Icecrown Citadel
    760, // Onyxia
    761, // Ruby Sanctum
    // Cata
    72, // Bastion of Twilight
    73, // Blackwing Descent
    74, // Throne of the Four Winds
    75, // Baradin Hold
    187, // Dragon Soul
    // MoP
    317, // Mogu'shan Vaults
    320, // Terrace of Endless Spring
    330, // Heart of Fear
    362, // Throne of Thunder
]);
