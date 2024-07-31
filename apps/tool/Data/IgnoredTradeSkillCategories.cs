namespace Wowthing.Tool.Data;

public static partial class Hardcoded
{
    public static readonly HashSet<int> IgnoredTradeSkillCategories = new()
    {
        // Alchemy
        1525, // Legion - Quest Recipes
        1250, // Shadowlands - Training
        1687, // Dragonflight - Quest Recipes

        // Blacksmithing
        424, // Legion - Training
        1522, // Shadowlands - Quest Recipes
        1688, // Dragonflight - Quest Plans

        // Cooking
        1526, // Shadowlands - Quest Recipes

        // Enchanting
        1255, // Battle for Azeroth - Training
        1527, // Shadowlands - Quest Recipes
        1690, // Dragonflight - Quest Formulas

        // Engineering
        1528, // Shadowlands - Quest Recipes
        1691, // Dragonflight - Quest Schematics

        // Herbalism
        1689, // Dragonflight - Quest Techniques
        1699, // Tracking

        // Inscription
        1529, // Shadowlands - Quest Recipes
        1692, // Dragonflight - Quest Techniques

        // Jewelcrafting
        536, // Legion - Training
        1530, // Shadowlands - Quest Recipes
        1686, // Dragonflight - Quest Designs

        // Leatherworking
        402, // Warlords - Tents
        468, // Legion - Basic Training
        484, // Legion - Material Preparation Training
        485, // Legion - Tanning Training
        486, // Legion - Shaping Training
        487, // Legion - Stitching Training
        1531, // Shadowlands - Quest Recipes
        1693, // Dragonflight - Quest Patterns

        // Mining
        1694, // Dragonflight - Quest Techniques
        1698, // Tracking

        // Skinning
        1695, // Dragonflight - Quest Techniques

        // Tailoring
        432, // Legion - Training
        1532, // Shadowlands - Quest Recipes
        1696, // Dragonflight - Quest Patterns
    };
}
