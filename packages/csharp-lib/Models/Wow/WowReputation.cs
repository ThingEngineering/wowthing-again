using System.ComponentModel.DataAnnotations;

namespace Wowthing.Lib.Models.Wow;

public class WowReputation
{
    [Key]
    public short Id { get; set; }

    public short Expansion { get; set; }
    public short ParagonId { get; set; }
    public short ParentId { get; set; }
    public short RenownCurrencyId { get; set; }
    public short TierId { get; set; }
    public bool AccountWide { get; set; }

    public WowReputation(short id)
    {
        Id = id;
    }
}
