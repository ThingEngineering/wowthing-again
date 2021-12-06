using System.Collections.Generic;

namespace Wowthing.Backend.Data
{
    public static partial class Hardcoded
    {
        private static readonly Dictionary<int, int> ShadowlandsDungeon = new()
        {
            { 2, 6806 }, // Heroic
            { 8, 6807 }, // Mythic Keystone
            { 23, 6807 }, // Mythic
        };

        private static readonly Dictionary<int, int> ShadowlandsRaid = new()
        {
            { 14, 0 }, // Normal
            { 15, 6806 }, // Heroic
            { 16, 6807 }, // Mythic
            { 17, 7186 }, // LFR
        };
        
        public static Dictionary<int, Dictionary<int, int>> InstanceBonusIds = new()
        {
            {1182, ShadowlandsDungeon}, // The Necrotic Wake
            {1183, ShadowlandsDungeon}, // Plaguefall
            {1184, ShadowlandsDungeon}, // Mists of Tirna Scithe
            {1185, ShadowlandsDungeon}, // Halls of Atonement
            {1186, ShadowlandsDungeon}, // Spires of Ascension
            {1187, ShadowlandsDungeon}, // Theater of Pain
            {1188, ShadowlandsDungeon}, // De Other Side
            {1189, ShadowlandsDungeon}, // Sanguine Depths
            {1194, ShadowlandsDungeon}, // Tazavesh, the Veiled Market
            
            {1190, ShadowlandsRaid}, // Castle Nathria
            {1193, ShadowlandsRaid}, // Sanctum of Domination
        };
    }
}
