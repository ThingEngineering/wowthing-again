using System.ComponentModel.DataAnnotations;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Wow;

public class WowCurrency
{
    [Key]
    public short Id { get; set; }

    public short CategoryId { get; set; }
    public short RechargeAmount { get; set; }
    public short TransferPercent { get; set; }
    public int MaxPerWeek { get; set; }
    public int MaxTotal { get; set; }
    public long RechargeInterval { get; set; }
    public WowCurrencyFlags Flags { get; set; }

    public WowCurrency(short id)
    {
        Id = id;
    }
}
