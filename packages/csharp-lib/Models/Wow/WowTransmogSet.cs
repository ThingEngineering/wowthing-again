using System.ComponentModel.DataAnnotations;

namespace Wowthing.Lib.Models.Wow;

public class WowTransmogSet
{
    [Key]
    public int Id { get; set; }

    public int ClassMask { get; set; }
    public int ItemNameDescriptionId { get; set; }

    public short Flags { get; set; }
    public short GroupId { get; set; }

    public List<int> ItemModifiedAppearanceIds { get; set; }

    public WowTransmogSet(int id)
    {
        Id = id;
    }
}
