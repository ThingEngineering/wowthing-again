using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Wow;

public class WowItemModifiedAppearance
{
    public int Id { get; set; }
    public int ItemId { get; set; }
    public int AppearanceId { get; set; }
    public short Modifier { get; set; }
    public short Order { get; set; }
    public TransmogSourceType SourceType { get; set; }

    public WowItemModifiedAppearance(int id)
    {
        Id = id;
    }
}
