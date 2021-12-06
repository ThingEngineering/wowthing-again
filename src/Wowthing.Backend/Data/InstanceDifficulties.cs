using System.Collections.Generic;

namespace Wowthing.Backend.Data
{
    public static partial class Hardcoded
    {
        public static readonly Dictionary<int, int[]> InstanceDifficulties = new()
        {
            // World bosses should only be normal
            { 322, new[] { 14 } }, // Pandaria
            { 822, new[] { 14 } }, // Broken Isles
            { 1028, new[] { 14 } }, // Azeroth
            { 1192, new[] { 14 } }, // Shadowlands
            
            // Other normal raids
            { 75, new[] { 14 } }, // Baradin Hold
            { 959, new[] { 14 } }, // Invasion Points
        };
    }
}
