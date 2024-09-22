namespace Wowthing.Tool.Models.Professions;

public class OutProfessionAbility
{
    public short Faction { get; set; } = (short)WowFaction.Neutral;
    public int FirstCraftQuestId { get; set; }
    public int Id { get; set; }
    public int ItemId { get; set; }
    public int ItemId2 { get; set; }
    public int Min { get; set; }
    public int Skillups { get; set; }
    public int Source { get; set; }
    public int SpellId { get; set; }
    public int TrivialHigh { get; set; }
    public int TrivialLow { get; set; }
    public string Name { get; set; }
    public List<int> Ranks { get; set; }
    public StaticProfessionReagentsSpell? Reagents { get; set; }

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
