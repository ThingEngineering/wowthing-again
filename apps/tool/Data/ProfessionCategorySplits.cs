namespace Wowthing.Tool.Data;

public static partial class Hardcoded
{
    private static readonly ProfessionCategorySplit[] BattleForAzerothPvp =
    [
        new("Notorious Combatant"),
        new("Uncanny Combatant"),
        new("Sinister Combatant"),
        new("Honorable Combatant"),
    ];
    private static readonly ProfessionCategorySplit[] MistsOfPandariaPvp =
    [
        new("Dreadful", anywhere: true),
        new("Malevolent", anywhere: true),
    ];

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
        { 547, BattleForAzerothPvp }, // Battle for Azeroth > Armor
        { 548, BattleForAzerothPvp }, // Battle for Azeroth > Weapons
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
        { 554, MistsOfPandariaPvp }, // Mists of Pandaria > Helms
        { 555, MistsOfPandariaPvp }, // Mists of Pandaria > Shoulders
        { 559, MistsOfPandariaPvp }, // Mists of Pandaria > Chest
        { 560, MistsOfPandariaPvp }, // Mists of Pandaria > Bracers
        { 561, MistsOfPandariaPvp }, // Mists of Pandaria > Gloves
        { 562, MistsOfPandariaPvp }, // Mists of Pandaria > Belts
        { 563, MistsOfPandariaPvp }, // Mists of Pandaria > Pants
        { 564, MistsOfPandariaPvp }, // Mists of Pandaria > Boots
        {
            579, // WotLK > Armor
            [
                new ProfessionCategorySplit("Cobalt"),
                new ProfessionCategorySplit("Spiked Cobalt"),
                new ProfessionCategorySplit("Brilliant Saronite"),
                new ProfessionCategorySplit("Ornate Saronite"),
                new ProfessionCategorySplit("Savage Saronite"),
                new ProfessionCategorySplit("Tempered Saronite"),
            ]
        },


        // Engineering
        {
            470, // Legion > Goggles
            [
                new ProfessionCategorySplit("Cranial Cannon", anywhere: true),
                new ProfessionCategorySplit("Headgun", anywhere: true),
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
        { 883, BattleForAzerothPvp }, // Battle for Azeroth > Leather Armor
        { 884, BattleForAzerothPvp }, // Battle for Azeroth > Mail Armor
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
        { 891, MistsOfPandariaPvp }, // Mists of Pandaria > Helms
        { 892, MistsOfPandariaPvp }, // Mists of Pandaria > Shoulders
        { 893, MistsOfPandariaPvp }, // Mists of Pandaria > Chest
        { 894, MistsOfPandariaPvp }, // Mists of Pandaria > Bracers
        { 895, MistsOfPandariaPvp }, // Mists of Pandaria > Gloves
        { 896, MistsOfPandariaPvp }, // Mists of Pandaria > Belts
        { 897, MistsOfPandariaPvp }, // Mists of Pandaria > Pants
        { 898, MistsOfPandariaPvp }, // Mists of Pandaria > Boots

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
            new[] {
                new ProfessionCategorySplit("Seaweave", anywhere: true),
                new ProfessionCategorySplit("Deep Sea", anywhere: true),
            }.Union(BattleForAzerothPvp).ToArray()
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
