using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Spells;

// ReSharper disable InconsistentNaming
public class DumpSpellReagents
{
    public int SpellID { get; set; }

    [Name("Reagent[0]")]
    public int Reagent0 { get; set; }

    [Name("Reagent[1]")]
    public int Reagent1 { get; set; }

    [Name("Reagent[2]")]
    public int Reagent2 { get; set; }

    [Name("Reagent[3]")]
    public int Reagent3 { get; set; }

    [Name("Reagent[4]")]
    public int Reagent4 { get; set; }

    [Name("Reagent[5]")]
    public int Reagent5 { get; set; }

    [Name("Reagent[6]")]
    public int Reagent6 { get; set; }

    [Name("Reagent[7]")]
    public int Reagent7 { get; set; }

    [Name("ReagentCount[0]")]
    public int ReagentCount0 { get; set; }

    [Name("ReagentCount[1]")]
    public int ReagentCount1 { get; set; }

    [Name("ReagentCount[2]")]
    public int ReagentCount2 { get; set; }

    [Name("ReagentCount[3]")]
    public int ReagentCount3 { get; set; }

    [Name("ReagentCount[4]")]
    public int ReagentCount4 { get; set; }

    [Name("ReagentCount[5]")]
    public int ReagentCount5 { get; set; }

    [Name("ReagentCount[6]")]
    public int ReagentCount6 { get; set; }

    [Name("ReagentCount[7]")]
    public int ReagentCount7 { get; set; }

    public List<(int, int)> Reagents => new()
    {
        (ReagentCount0, Reagent0),
        (ReagentCount1, Reagent1),
        (ReagentCount2, Reagent2),
        (ReagentCount3, Reagent3),
        (ReagentCount4, Reagent4),
        (ReagentCount5, Reagent5),
        (ReagentCount6, Reagent6),
        (ReagentCount7, Reagent7),
    };
}
