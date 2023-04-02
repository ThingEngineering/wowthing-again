using Wowthing.Tool.Models.Transmog;

namespace Wowthing.Tool.Models.Static;

public class StaticIllusion
{
    public int EnchantmentId { get; set; }
    public int Id { get; set; }
    public string Name { get; set; }

    public StaticIllusion(DumpTransmogIllusion illusion)
    {
        EnchantmentId = illusion.SpellItemEnchantmentID;
        Id = illusion.ID;
    }
}
