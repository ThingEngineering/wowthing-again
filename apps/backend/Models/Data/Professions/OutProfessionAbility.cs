namespace Wowthing.Backend.Models.Data.Professions;

public class OutProfessionAbility
{
    public int TrivialHigh { get; set; }
    public int Id { get; set; }
    public int TrivialLow { get; set; }
    public int Min { get; set; }
    public int Skillups { get; set; }
    public int SpellId { get; set; }
    public string Name { get; set; }
    public List<int> Ranks { get; set; }

    public OutProfessionAbility(DumpSkillLineAbility ability, string spellName)
    {
        Id = ability.ID;
        Min = ability.MinSkillLineRank;
        Skillups = ability.NumSkillUps;
        SpellId = ability.Spell;
        TrivialHigh = ability.TrivialSkillLineRankHigh;
        TrivialLow = ability.TrivialSkillLineRankLow;
        Name = spellName;
    }
}
