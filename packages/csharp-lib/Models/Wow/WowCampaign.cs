using System.ComponentModel.DataAnnotations;

namespace Wowthing.Lib.Models.Wow;

public class WowCampaign
{
    [Key]
    public int Id { get; set; }

    public List<int> QuestLineIds { get; set; }

    public WowCampaign(int id)
    {
        Id = id;
    }
}
