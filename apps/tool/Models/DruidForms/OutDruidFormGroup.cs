namespace Wowthing.Tool.Models.DruidForms;

[JsonConverter(typeof(OutDruidFormGroupConverter))]
public class OutDruidFormGroup
{
    public List<OutDruidFormItem> Items { get; } = new();
    public string Name { get; }

    public OutDruidFormGroup(DataDruidFormGroup group)
    {
        Name = group.Name;
    }
}
