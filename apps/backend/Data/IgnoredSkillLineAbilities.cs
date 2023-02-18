namespace Wowthing.Backend.Data;

public static partial class Hardcoded
{
    public static readonly HashSet<int> IgnoredSkillLineAbilities = new()
    {
        // Alchemy
        28577, // Major Holy Protection Potion
        156567, // Draenor Armor Flask
        370771, // Dragon Isles Alchemy Troubleshooting Test Recipe (DNT)
        371635, // Demonstration Item Recipe

        // Jewelcrafting
        25614, // Silver Rose Pendant

        // Mining
        389465, // Severite Seam
        389458, // Draconium Seam
    };
}
