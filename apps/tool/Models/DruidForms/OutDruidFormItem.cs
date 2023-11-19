namespace Wowthing.Tool.Models.DruidForms;

public class OutDruidFormItem
{
    public int ItemId { get; }
    public int QuestId { get; set; }

    public OutDruidFormItem(int itemId)
    {
        ItemId = itemId;
    }
}
