namespace Wowthing.Tool.Data;

public static partial class Hardcoded
{
    public static readonly HashSet<int> SkipInstances = new()
    {
        // Reused map IDs for world boss sections? Sigh
        322, // Pandaria
        557, // Draenor
        822, // Broken Isles
        959, // Invasion Points
        1028, // Azeroth
    };
}
