namespace Wowthing.Backend.Data;

public static partial class Hardcoded
{
    public static readonly HashSet<int> IgnoredSkillLineAbilities = new()
    {
        #region Mining
        // Dragonflight
        389465, // Severite Seam
        389458, // Draconium Seam
        #endregion
    };
}
