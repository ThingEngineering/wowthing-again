namespace Wowthing.Backend.Data;

public static partial class Hardcoded
{
    public static readonly Dictionary<(int, int), int[]> InstanceDifficulties = new()
    {
        // World bosses should only be normal
        { (74, 322), new[] { 14 } }, // MoP > Pandaria
        { (395, 822), new[] { 14 } }, // Legion > Broken Isles
        { (396, 1028), new[] { 14 } }, // BfA > Azeroth
        { (499, 1192), new[] { 14 } }, // SL > Shadowlands

        // Other normal raids
        { (73, 75), new[] { 14 } }, // Cata > Baradin Hold
        { (395, 959), new[] { 14 } }, // Legion > Invasion Points

        // Ugh
        { (68, 63), new[] { 1 } }, // Classic > Deadmines [N]
        { (73, 63), new[] { 2 } }, // Cata > Deadmines [H]

        { (68, 64), new[] { 1 } }, // Classic > Shadowfang Keep [N]
        { (73, 64), new[] { 2 } }, // Cata > Shadowfang Keep [H]
    };
}
