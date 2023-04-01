using Wowthing.Lib.Models.Wow;
using Wowthing.Tool.Converters.Static;

namespace Wowthing.Tool.Models.Static;

[JsonConverter(typeof(StaticCurrencyCategoryConverter))]
public class StaticCurrencyCategory
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Slug { get; set; }

    public StaticCurrencyCategory(WowCurrencyCategory currencyCategory)
    {
        Id = currencyCategory.Id;
    }
}
