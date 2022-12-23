namespace Wowthing.Backend.Data;

public static partial class Hardcoded
{
    public static readonly HashSet<int> IgnoredTradeSkillCategories = new()
    {
        #region Alchemy
        1687, // Dragonflight - Quest Recipes
        #endregion

        #region Blacksmithing
        1688, // Dragonflight - Quest Plans
        #endregion

        #region Enchanting
        1690, // Dragonflight - Quest Formulas
        #endregion

        #region Engineering
        1691, // Dragonflight - Quest Schematics
        #endregion

        #region Herbalism
        1689, // Dragonflight - Quest Techniques
        1699, // Tracking
        #endregion

        #region Inscription
        1692, // Dragonflight - Quest Techniques
        #endregion

        #region Jewelcrafting
        1686, // Dragonflight - Quest Designs
        #endregion

        #region Leatherworking
        1693, // Dragonflight - Quest Patterns
        #endregion

        #region Mining
        1694, // Dragonflight - Quest Techniques
        1698, // Tracking
        #endregion

        #region Skinning
        1695, // Dragonflight - Quest Techniques
        #endregion

        #region Tailoring
        1696, // Dragonflight - Quest Patterns
        #endregion

    };
}
