using CsvHelper.Configuration.Attributes;

// ReSharper disable InconsistentNaming
namespace Wowthing.Backend.Models.Data.Covenants;

public class DumpSoulbind
{
    public int ID { get; set; }
        
    public int CovenantID { get; set; }
    public int GarrTalentTreeID { get; set; }
        
    [Name("Name_lang")]
    public string Name { get; set; }
}