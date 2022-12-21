namespace Wowthing.Backend.Models.Data.Professions;

public class OutProfessionAbility
{
    public int High { get; set; }
    public int Low { get; set; }
    public int Min { get; set; }
    public int Skillups { get; set; }
    public int SpellId { get; set; }
    public string Name { get; set; }

    public OutProfessionAbility(DumpSkillLineAbility ability, string spellName)
    {
        Min = ability.MinSkillLineRank;
        Skillups = ability.NumSkillUps;
        SpellId = ability.Spell;
        Low = ability.TrivialSkillLineRankLow;
        High = ability.TrivialSkillLineRankHigh;
        Name = spellName;
    }
}
