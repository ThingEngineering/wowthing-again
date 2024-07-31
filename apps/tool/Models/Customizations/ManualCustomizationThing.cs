namespace Wowthing.Tool.Models.Customizations;

public class ManualCustomizationThing
{
    public int AchievementId { get; set; }
    public int AppearanceModifier { get; set; } = -1;
    public int ItemId { get; set; }
    public int QuestId { get; set; }
    public int SpellId { get; set; }
    public string Name { get; set; } = string.Empty;

    public ManualCustomizationThing()
    {
    }

    public ManualCustomizationThing(DataCustomizationThing dataThing)
    {
        AchievementId = dataThing.AchievementId;
        ItemId = dataThing.ItemId;
        QuestId = dataThing.QuestId;
        Name = dataThing.Name;
    }
}
