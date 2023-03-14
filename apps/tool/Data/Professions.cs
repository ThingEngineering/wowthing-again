namespace Wowthing.Tool.Data;

public static partial class Hardcoded
{
    public static readonly HashSet<int> PrimaryProfessions = new()
    {
        171, // Alchemy
        164, // Blacksmithing
        333, // Enchanting
        202, // Engineering
        182, // Herbalism
        773, // Inscription
        755, // Jewelcrafting
        165, // Leatherworking
        186, // Mining
        393, // Skinning
        197, // Tailoring
    };

    public static readonly HashSet<int> SecondaryProfessions = new()
    {
        185, // Cooking
        356, // Fishing
        794, // Archaeology
    };

    public static readonly HashSet<int> IgnoredProfessions = new()
    {
        981, // Apprentice Cooking
        982, // Journeyman Cookbook
    };
}
