namespace Wowthing.Backend.Models.Data.Professions;

public class OutProfessionCategory
{
    public int Id { get; set; }
    public int Order { get; set; }
    public string Name { get; set; }
    public OutProfessionAbility[] Abilities { get; set; }
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
