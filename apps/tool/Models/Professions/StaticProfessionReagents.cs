namespace Wowthing.Tool.Models.Professions;

public class StaticProfessionReagents
{
    public Dictionary<short, int[]> Categories { get; set; }
    public Dictionary<int, StaticProfessionReagentsSpell> Spells { get; set; } = [];
}

public class StaticProfessionReagentsSpell(int id)
{
    public int Id { get; set; } = id;
    public List<StaticProfessionReagentsSpellReagent> Reagents { get; set; } = [];
}

public class StaticProfessionReagentsSpellReagent
{
    public short Count { get; set; }
    public short[] CategoryIds { get; set; }
}
