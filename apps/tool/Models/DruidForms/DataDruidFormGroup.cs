namespace Wowthing.Tool.Models.DruidForms;

// [JsonConverter(typeof(DataHeirloomGroupConverter))]
public class DataDruidFormGroup
{
    public string Name { get; set; } = string.Empty;
    public int[]? Items { get; set; }
}
