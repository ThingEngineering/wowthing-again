namespace Wowthing.Tool.Data;

public static partial class Hardcoded
{
    private static readonly ProfessionCategorySplit[] BattleForAzerothPvp = {
        new("Notorious Combatant"),
        new("Uncanny Combatant"),
        new("Sinister Combatant"),
        new("Honorable Combatant"),
    };

    public static readonly Dictionary<int, ProfessionCategorySplit[]> ProfessionCategorySplits = new()
    {
        // Blacksmithing
        {
            1567, // Dragonflight > Armor
            [
                new ProfessionCategorySplit("Explorer"),
                new ProfessionCategorySplit("Primal Molten"),
                new ProfessionCategorySplit("Crimson Combatant"),
                new ProfessionCategorySplit("Obsidian Combatant"),
                new ProfessionCategorySplit("Verdant Combatant"),
            ]
        },
        {
            1675, // Dragonflight > Weapons
            [
                new ProfessionCategorySplit("Draconium"),
                new ProfessionCategorySplit("Obsidian Seared"),
                new ProfessionCategorySplit("Primal Molten"),
            ]
        },
        {
            547, // Battle for Azeroth > Armor
            BattleForAzerothPvp
        },
        {
            548, // Battle for Azeroth > Weapons
            BattleForAzerothPvp
        },
        {
            427, // Legion > Armor
            [
                new ProfessionCategorySplit("Demonsteel"),
                new ProfessionCategorySplit("Leystone"),
            ]
        },
        {
            570, // Cataclysm > Armor
            [
                new ProfessionCategorySplit("Vicious"),
            ]
        },

        // Leatherworking
        {
            1472, // Shadowlands > Specialized Armor
            [
                new ProfessionCategorySplit("Boneshatter"),
                new ProfessionCategorySplit("Umbrahide"),
            ]
        },
        {
            883, // Battle for Azeroth > Leather Armor
            BattleForAzerothPvp
        },
        {
            884, // Battle for Azeroth > Mail Armor
            BattleForAzerothPvp
        },
        {
            461, // Legion > Leather Armor
            [
                new ProfessionCategorySplit("Dreadleather"),
                new ProfessionCategorySplit("Warhide"),
            ]
        },
        {
            462, // Legion > Mail Armor
            [
                new ProfessionCategorySplit("Gravenscale"),
                new ProfessionCategorySplit("Battlebound"),
            ]
        },

        // Tailoring
        {
            1662, // Dragonflight > Garments
            [
                new ProfessionCategorySplit("Surveyor"),
                new ProfessionCategorySplit("Vibrant"),
                new ProfessionCategorySplit("Crimson Combatant"),
                new ProfessionCategorySplit("Obsidian Combatant"),
                new ProfessionCategorySplit("Verdant Combatant"),
            ]
        },
        {
            944, // Battle for Azeroth > Armor
            BattleForAzerothPvp
        },
        {
            495, // Legion > Cloth Armor
            [
                new ProfessionCategorySplit("Imbued Silkweave"),
                new ProfessionCategorySplit("Silkweave"),
            ]
        },
    };
}

public class ProfessionCategorySplit(string name, string? prefix = null, bool anywhere = false)
{
    public string Name { get; } = name;
    public string Prefix { get; } = prefix ?? name;
    private bool Anywhere { get; } = anywhere;

    public bool Matches(string target)
    {
        return Anywhere ? target.Contains(Prefix) : target.StartsWith(Prefix);
    }
}
