using System.ComponentModel.DataAnnotations;

namespace Wowthing.Lib.Models.Wow;

public class WowQuestLine
{
    [Key]
    public int Id { get; set; }

    public List<int> QuestIds { get; set; }

    public WowQuestLine(int id)
    {
        Id = id;
    }
}
