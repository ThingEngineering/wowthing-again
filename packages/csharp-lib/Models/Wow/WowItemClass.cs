using System.ComponentModel.DataAnnotations;

namespace Wowthing.Lib.Models.Wow;

public class WowItemClass
{
    [Key]
    public short Id { get; set; }

    public short ClassId { get; set; }
}
