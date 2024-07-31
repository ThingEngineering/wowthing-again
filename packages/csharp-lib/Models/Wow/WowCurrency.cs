using System.ComponentModel.DataAnnotations;

namespace Wowthing.Lib.Models.Wow;

public class WowCurrency
{
    [Key]
    public short Id { get; set; }

    public short CategoryId { get; set; }
    public int MaxPerWeek { get; set; }
    public int MaxTotal { get; set; }

    public WowCurrency(short id)
    {
        Id = id;
    }
}
