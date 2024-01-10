namespace Wowthing.Tool.Data;

public static partial class Hardcoded
{
    public static readonly Dictionary<int, ProfessionCategorySplit[]> ProfessionCategorySplits = new()
    {
        {
            1567, // Blacksmithing > Dragonflight > Armor
            [
                new ProfessionCategorySplit("Explorer's"),
                new ProfessionCategorySplit("Primal Molten"),
                new ProfessionCategorySplit("Crimson Combatant's"),
                new ProfessionCategorySplit("Obsidian Combatant's"),
                new ProfessionCategorySplit("Verdant Combatant's"),
            ]
        },
        {
            1675, // Blacksmithing > Dragonflight > Weapons
            [
                new ProfessionCategorySplit("Draconium"),
                new ProfessionCategorySplit("Obsidian Seared"),
                new ProfessionCategorySplit("Primal Molten"),
            ]
        },
        {
            1662, // Tailoring > Dragonflight > Garments
            [
                new ProfessionCategorySplit("Surveyor's"),
                new ProfessionCategorySplit("Vibrant"),
                new ProfessionCategorySplit("Crimson Combatant's"),
                new ProfessionCategorySplit("Obsidian Combatant's"),
                new ProfessionCategorySplit("Verdant Combatant's"),
            ]
        },
    };
}

public class ProfessionCategorySplit(string name, string? prefix = null)
{
    public string Name { get; set; } = name;
    public string Prefix { get; set; } = prefix ?? name;
}
