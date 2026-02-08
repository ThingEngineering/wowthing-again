using System.ComponentModel.DataAnnotations;

namespace Wowthing.Lib.Models.Wow;

public class WowDecor
{
    [Key]
    public int Id { get; set; }

    public int ItemId { get; set; }
    public short Type { get; set; }

    public WowDecor(int id)
    {
        Id = id;
    }
}
