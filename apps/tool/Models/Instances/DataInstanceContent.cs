using Wowthing.Tool.Enums;

namespace Wowthing.Tool.Models.Instances;

public class DataInstanceContent
{
    public int ItemId { get; set; }
    public InstanceContentAction Action { get; set; }
    public string? Difficulties { get; set; }
}
