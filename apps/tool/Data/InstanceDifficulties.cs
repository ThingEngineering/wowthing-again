namespace Wowthing.Tool.Data;

public static partial class Hardcoded
{
    // (JournalTier, JournalInstance)
    public static readonly Dictionary<(int, int), int[]> InstanceDifficulties = new()
    {
        // World bosses should only be normal
        { (74, 322), [14] }, // MoP > Pandaria
        { (395, 822), [14] }, // Legion > Broken Isles
        { (396, 1028), [14] }, // BfA > Azeroth
        { (499, 1192), [14] }, // SL > Shadowlands
        { (503, 1205), [14] }, // DF > Dragonflight

        // Ruins of Ahn'Qiraj is 10 Normal only
        { (68, 743), [3] },

        // Other normal raids
        { (73, 75), [14] }, // Cata > Baradin Hold
        { (395, 959), [14] }, // Legion > Invasion Points

        // Ugh
        { (68, 63), [1] }, // Classic > Deadmines [N]
        { (73, 63), [2] }, // Cata > Deadmines [H]

        { (68, 64), [1] }, // Classic > Shadowfang Keep [N]
        { (73, 64), [2] }, // Cata > Shadowfang Keep [H]

        { (68, 246), [1] }, // Classic > Scholomance [N]
        { (74, 246), [2, 24] }, // MoP > Scholomance [N,T]

        { (73, 68), [1, 2] }, // Cata > Vortex Pinnacle [N,H,T]
        { (503, 68), [23, 24] }, // DF > Vortex Pinnacle [M+]

        // Timewalking
        { (395, 740), [1, 2, 23, 24] }, // Legion > Black Rook Hold
        { (395, 800), [1, 2, 23, 24] }, // Legion > Court of Stars
        { (395, 762), [1, 2, 23, 24] }, // Legion > Darkheart Thicket
        { (395, 716), [1, 2, 23, 24] }, // Legion > Eye of Azshara
        { (395, 767), [1, 2, 23, 24] }, // Legion > Neltharion's Lair
        { (395, 707), [1, 2, 23, 24] }, // Legion > Vault of the Wardens
    };
}
