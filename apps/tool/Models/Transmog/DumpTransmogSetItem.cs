namespace Wowthing.Tool.Models.Transmog;

// ReSharper disable InconsistentNaming
public class DumpTransmogSetItem
{
    public int ID { get; set; }

    public int Flags { get; set; }
    public int ItemModifiedAppearanceID { get; set; }
    public int TransmogSetID { get; set; }

    public bool IsPrimary => Hardcoded.TransmogSetItemPrimaryOverride.GetValueOrDefault(ID, Flags & 0x1) == 0x1;
}
