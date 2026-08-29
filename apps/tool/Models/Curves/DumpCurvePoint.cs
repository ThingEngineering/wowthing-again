using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Curves;

// ReSharper disable InconsistentNaming
public class DumpCurvePoint
{
    public int ID { get; set; }

    public int CurveID { get; set; }
    public int OrderIndex { get; set; }

    [Name("Pos[0]")]
    public double Pos0 { get; set; }

    [Name("Pos[1]")]
    public double Pos1 { get; set; }

    [Name("PosPreSquish[0]")]
    public double PosPreSquish0 { get; set; }

    [Name("PosPreSquish[1]")]
    public double PosPreSquish1 { get; set; }
}
