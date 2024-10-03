using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Spells;

public class GameTableSpellScaling
{
    public short Level {  get; set; }
    public double Consumable { get; set; }
    public double DamageReplaceStat { get; set; }
    public double Gem1 { get; set; }
    public double Gem2 { get; set; }
    public double Gem3 { get; set; }
    public double Health { get; set; }
    public double Item { get; set; }
}
