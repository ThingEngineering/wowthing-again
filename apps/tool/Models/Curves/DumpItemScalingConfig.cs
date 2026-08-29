using Wowthing.Tool.Converters.Curves;

namespace Wowthing.Tool.Models.Curves;

// ReSharper disable InconsistentNaming
[JsonConverter(typeof(DumpItemScalingConfigConverter))]
public class DumpItemScalingConfig
{
    public int ID { get; set; }

    public int Flags { get; set; }
    public int ItemLevel { get; set; }
    public int ItemOffsetCurveID { get; set; }
    public int ItemSquishEraID { get; set; }
    public int RequiredLevel { get; set; }
}
