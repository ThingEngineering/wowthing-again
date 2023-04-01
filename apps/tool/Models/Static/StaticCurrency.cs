using Wowthing.Lib.Models.Wow;
using Wowthing.Tool.Converters.Static;

namespace Wowthing.Tool.Models.Static;

[JsonConverter(typeof(StaticCurrencyConverter))]
public class StaticCurrency
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public int MaxPerWeek { get; set; }
    public int MaxTotal { get; set; }
    public string Name { get; set; }

    public StaticCurrency(WowCurrency currency)
    {
        Id = currency.Id;
        CategoryId = currency.CategoryId;
        MaxPerWeek = currency.MaxPerWeek;
        MaxTotal = currency.MaxTotal;
    }
}
