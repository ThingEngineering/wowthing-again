using System.ComponentModel.DataAnnotations;

namespace Wowthing.Lib.Models.Wow;

public class WowCurrencyCategory
{
    [Key]
    public short Id { get; set; }

    public short Expansion { get; set; }
    public short Flags { get; set; }

    public WowCurrencyCategory(short id)
    {
        Id = id;
    }
}
