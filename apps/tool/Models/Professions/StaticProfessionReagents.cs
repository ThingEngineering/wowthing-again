namespace Wowthing.Tool.Models.Professions;

public class StaticProfessionReagents
{
    public Dictionary<short, int[]> Categories { get; set; }
    public Dictionary<int, StaticProfessionReagentsSpell> Spells { get; set; } = [];
}

public class StaticProfessionReagentsSpell
{
    public List<StaticProfessionReagentsSpellReagent> CategoryReagents { get; } = [];
    public List<(int, int)> ItemReagents { get; } = [];
}

public class StaticProfessionReagentsSpellReagent
{
    public short Count { get; set; }
    public short[] CategoryIds { get; set; }
}
