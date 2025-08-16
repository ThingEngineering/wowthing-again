using System.ComponentModel.DataAnnotations;
using Wowthing.Lib.Constants;

namespace Wowthing.Lib.Models.Wow;

public class WowQuest
{
    [Key]
    public int Id { get; set; }
    public int AreaId { get; set; }
    public int CategoryId { get; set; }
    public short MinimumLevel { get; set; }
    public short MaximumLevel { get; set; }

    public DateTime LastApiCheck { get; set; } = MiscConstants.DefaultDateTime;

    public WowQuest(int id)
    {
        Id = id;
    }
}
