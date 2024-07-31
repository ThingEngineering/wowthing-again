namespace Wowthing.Tool.Models.Professions;

[JsonConverter(typeof(OutProfessionCategoryConverter))]
public class OutProfessionCategory
{
    public int Id { get; set; }
    public int Order { get; set; }
    public string Name { get; set; }
    public List<OutProfessionAbility> Abilities { get; set; } = new();
    public List<OutProfessionCategory> Children { get; set; } = new();

    public OutProfessionCategory(DumpTradeSkillCategory category)
    {
        Id = category.ID;
        Order = category.OrderIndex;

        Name = !string.IsNullOrEmpty(category.HordeName)
            ? $"{category.AllianceName}|{category.HordeName}"
            : category.AllianceName;
    }
}
