using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.Wow;

public class WowWorldQuest
{
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int Id { get; set; }

    public short Expansion { get; set; }
    public short MaxLevel { get; set; }
    public short MinLevel { get; set; }
    public short QuestInfoId { get; set; }

    public List<int> NeedQuestIds { get; set; } = new();
    public List<int> SkipQuestIds { get; set; } = new();

    public WowWorldQuest(int id)
    {
        Id = id;
    }
}
