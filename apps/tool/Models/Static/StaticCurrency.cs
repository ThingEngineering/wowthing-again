using Wowthing.Lib.Models.Wow;
using Wowthing.Tool.Converters.Static;

namespace Wowthing.Tool.Models.Static;

[JsonConverter(typeof(StaticCurrencyConverter))]
public class StaticCurrency
{
    public int Id { get; set; }
    public short CategoryId { get; set; }
    public short RechargeAmount { get; set; }
    public short TransferPercent { get; set; }
    public int MaxPerWeek { get; set; }
    public int MaxTotal { get; set; }
    public long RechargeInterval { get; set; }
    public string Description { get; set; }
    public string Name { get; set; }

    public StaticCurrency(WowCurrency currency)
    {
        Id = currency.Id;
        CategoryId = currency.CategoryId;
        MaxPerWeek = currency.MaxPerWeek;
        MaxTotal = currency.MaxTotal;
        RechargeAmount = currency.RechargeAmount;
        RechargeInterval = currency.RechargeInterval;
        TransferPercent = currency.TransferPercent;
    }
}
