using Wowthing.Backend.Converters.Static;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Backend.Models.Static;

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
