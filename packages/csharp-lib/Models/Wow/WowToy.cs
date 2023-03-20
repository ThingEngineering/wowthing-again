using System.ComponentModel.DataAnnotations;

namespace Wowthing.Lib.Models.Wow;

public class WowToy
{
    [Key]
    public int Id { get; set; }

    public int ItemId { get; set; }
    public int Flags { get; set; }
    public short SourceType { get; set; }

    public WowToy(int id)
    {
        Id = id;
    }
}
