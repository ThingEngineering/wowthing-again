using Wowthing.Tool.Converters.Static;

namespace Wowthing.Tool.Models.Housing;

[JsonConverter(typeof(StaticDecorCategoryConverter))]
public class StaticDecorCategory
{
    public short Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public List<StaticDecorSubcategory> Subcategories { get; set; } = [];
}
