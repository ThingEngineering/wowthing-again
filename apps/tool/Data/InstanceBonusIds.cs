namespace Wowthing.Tool.Data;

public static partial class Hardcoded
{
    private static readonly Dictionary<int, int> MopSiege = new()
    {
        { 15, 449 }, // Heroic
        { 16, 450 }, // Mythic
        { 17, 451 }, // LFR
    };

    private static readonly Dictionary<int, int> WodDungeon = new()
    {
        { 1, 4746 }, // Normal -> Warforged?
        { 2, 4202 }, // Heroic
        { 8, 4204 }, // Mythic Keystone
        { 23, 4204 }, // Mythic
    };

    private static readonly Dictionary<int, int> WodRaid1 = new()
    {
        { 15, 566 }, // Heroic
        { 16, 567 }, // Mythic
    };

    private static readonly Dictionary<int, int> WodHellfire = new()
    {
        { 15, 1798 }, // Heroic
        { 16, 1799 }, // Mythic
    };

    private static readonly Dictionary<int, int> LegionDungeon = new()
    {
        { 2, 1726 }, // Heroic
        { 8, 1727 }, // Mythic Keystone
        { 23, 1727 }, // Mythic Keystone
    };

    private static readonly Dictionary<int, int> LegionDungeonTimewalking = new()
    {
        { 2, 1726 }, // Heroic
        { 8, 1727 }, // Mythic Keystone
        { 23, 1727 }, // Mythic Keystone
        { 24, 8760 }, // Timewalking
    };

    private static readonly Dictionary<int, int> LegionEmerald = new()
    {
        { 15, 1805 }, // Heroic
        { 16, 1806 }, // Mythic
        { 17, 3379 }, // LFR
    };

    private static readonly Dictionary<int, int> LegionTrial = new()
    {
        { 15, 3468 }, // Heroic
        { 16, 3469 }, // Mythic
        { 17, 3470 }, // LFR
    };

    private static readonly Dictionary<int, int> LegionNighthold = new()
    {
        { 15, 3444 }, // Heroic
        { 16, 3445 }, // Mythic
        { 17, 3446 }, // LFR
    };

    private static readonly Dictionary<int, int> LegionTomb = new()
    {
        { 15, 3562 }, // Heroic
        { 16, 3563 }, // Mythic
        { 17, 3564 }, // LFR
    };

    private static readonly Dictionary<int, int> LegionAntorus = new()
    {
        { 15, 3611 }, // Heroic
        { 16, 3612 }, // Mythic
        { 17, 3613 }, // LFR
    };

    private static readonly Dictionary<int, int> BfaDungeon = new()
    {
        { 2, 4778 }, // Heroic
        { 8, 4779 }, // Mythic Keystone
        { 23, 4779 }, // Mythic
    };

    private static readonly Dictionary<int, int> BfaRaid1 = new()
    {
        { 14, 0 }, // Normal
        { 15, 4799 }, // Heroic
        { 16, 4800 }, // Mythic
        { 17, 4801 }, // LFR
    };

    private static readonly Dictionary<int, int> BfaRaid2 = new()
    {
        { 14, 0 }, // Normal
        { 15, 4823 }, // Heroic
        { 16, 4824 }, // Mythic
        { 17, 4825 }, // LFR
    };

    private static readonly Dictionary<int, int> SlDungeon = new()
    {
        { 2, 6806 }, // Heroic
        { 8, 6807 }, // Mythic Keystone
        { 23, 6807 }, // Mythic
    };

    private static readonly Dictionary<int, int> SlRaid = new()
    {
        { 14, 0 }, // Normal
        { 15, 6806 }, // Heroic
        { 16, 6807 }, // Mythic
        { 17, 7186 }, // LFR
    };

    private static readonly Dictionary<int, int> SlRaid2 = new()
    {
        { 14, 7189 }, // Normal
        { 15, 7188 }, // Heroic
        { 16, 7187 }, // Mythic
        { 17, 7186 }, // LFR
    };

    private static readonly Dictionary<int, int> DfRaid = new()
    {
        { 14, 9324 }, // Normal
        { 15, 7980 }, // Heroic
        { 16, 7981 }, // Mythic
        { 17, 7982 }, // LFR
    };

    private static readonly Dictionary<int, int> WarWithinRaid = new()
    {
        { 14, 9111 }, // Normal
        { 15, 9112 }, // Heroic
        { 16, 9113 }, // Mythic
        { 17, 9114 }, // LFR
    };

    public static readonly Dictionary<int, Dictionary<int, int>> InstanceBonusIds = new()
    {
        { 369, MopSiege }, // Siege of Orgrimmar

        // Warlords of Draenor
        { 385, WodDungeon }, // Bloodmaul Slag Mines
        { 476, WodDungeon }, // Skyreach
        { 536, WodDungeon }, // Grimrail Depot
        { 537, WodDungeon }, // Shadowmoon Burial Grounds
        { 547, WodDungeon }, // Auchindoun
        { 556, WodDungeon }, // The Everbloom
        { 558, WodDungeon }, // Iron Docks
        { 559, WodDungeon }, // Upper Blackrock Spire

        { 477, WodRaid1 }, // Highmaul
        { 457, WodRaid1 }, // Blackrock Foundry
        { 669, WodHellfire }, // Hellfire Citadel

        // Legion
        { 707, LegionDungeonTimewalking }, // Vault of the Wardens
        { 716, LegionDungeonTimewalking }, // Eye of Azshara
        { 721, LegionDungeon }, // Halls of Valor
        { 726, LegionDungeon }, // The Arcway
        { 727, LegionDungeon }, // Maw of Souls
        { 740, LegionDungeonTimewalking }, // Black Rook Hold
        { 762, LegionDungeonTimewalking }, // Darkheart Thicket
        { 767, LegionDungeonTimewalking }, // Neltharion's Lair
        { 777, LegionDungeon }, // Assault on Violet Hold
        { 800, LegionDungeonTimewalking }, // Court of Stars
        { 860, LegionDungeon }, // Return to Karazhan
        { 900, LegionDungeon }, // Cathedral of Eternal Night
        { 945, LegionDungeon }, // Seat of the Triumvirate

        { 768, LegionEmerald }, // Emerald Nightmare
        { 786, LegionNighthold }, // The Nighthold
        { 861, LegionTrial }, // Trial of Valor
        { 875, LegionTomb }, // Tomb of Sargeras
        { 946, LegionAntorus }, // Antorus, the Burning Throne

        // Battle for Azeroth
        { 968, BfaDungeon }, // Atal'Dazar
        { 1001, BfaDungeon }, // Freehold
        { 1002, BfaDungeon }, // Tol Dagor
        { 1012, BfaDungeon }, // THE MOTHERLODE!!
        { 1021, BfaDungeon }, // Waycrest Manor
        { 1022, BfaDungeon }, // The Underrot
        { 1023, BfaDungeon }, // Siege of Boralus
        { 1030, BfaDungeon }, // Temple of Sethraliss
        { 1036, BfaDungeon }, // Shrine of the Storm
        { 1041, BfaDungeon }, // Kings' Rest
        { 1178, BfaDungeon }, // Operation: Mechagon

        { 1031, BfaRaid1 }, // Uldir
        { 1176, BfaRaid2 }, // Battle of Dazar'alor
        { 1177, BfaRaid1 }, // Crucible of Storms
        { 1179, BfaRaid2 }, // The Eternal Palace
        { 1180, BfaRaid2 }, // Ny'alotha, The Waking City

        // Shadowlands
        { 1182, SlDungeon }, // The Necrotic Wake
        { 1183, SlDungeon }, // Plaguefall
        { 1184, SlDungeon }, // Mists of Tirna Scithe
        { 1185, SlDungeon }, // Halls of Atonement
        { 1186, SlDungeon }, // Spires of Ascension
        { 1187, SlDungeon }, // Theater of Pain
        { 1188, SlDungeon }, // De Other Side
        { 1189, SlDungeon }, // Sanguine Depths
        { 1194, SlDungeon }, // Tazavesh, the Veiled Market

        { 1190, SlRaid }, // Castle Nathria
        { 1193, SlRaid }, // Sanctum of Domination
        { 1195, SlRaid2 }, // Sepulcher of the First Ones

        // Dragonflight
        { 1200, DfRaid }, // Vault of the Incarnates
        { 1208, DfRaid }, // Aberrus, the Shadow Crucible
        { 1207, DfRaid }, // Amirdrassil, the Dream's Hope

        // The War Within
        { 1273, WarWithinRaid }, // Nerub-ar Palace
        { 1296, WarWithinRaid }, // Liberation of Undermine
        { 1302, WarWithinRaid }, // Manaforge Omega
    };
}

