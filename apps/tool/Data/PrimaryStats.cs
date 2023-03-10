namespace Wowthing.Tool.Data;

public partial class Hardcoded
{
    public static readonly Dictionary<int, WowStat[]> PrimaryStats = new()
    {
        { 3, new[] { WowStat.Agility } },
        { 4, new[] { WowStat.Strength } },
        { 5, new[] { WowStat.Intellect } },
        { 71, new[] { WowStat.Agility, WowStat.Intellect, WowStat.Strength } },
        { 72, new[] { WowStat.Agility, WowStat.Strength } },
        { 73, new[] { WowStat.Agility, WowStat.Intellect } },
        { 74, new[] { WowStat.Intellect, WowStat.Strength } },
    };

    public static readonly Dictionary<WowStat, WowStat[]> StatToStats = new()
    {
        { WowStat.None, Array.Empty<WowStat>() },
        { WowStat.Agility, new[] { WowStat.Agility } },
        { WowStat.Intellect, new[] { WowStat.Intellect } },
        { WowStat.Strength, new[] { WowStat.Strength } },
        { WowStat.AgilityIntellect, new[] { WowStat.Agility, WowStat.Intellect } },
        { WowStat.AgilityStrength, new[] { WowStat.Agility, WowStat.Strength } },
        { WowStat.AgilityIntellectStrength, new[] { WowStat.Agility, WowStat.Intellect, WowStat.Strength } },
        { WowStat.IntellectStrength, new[] { WowStat.Intellect, WowStat.Strength } },
    };
}
