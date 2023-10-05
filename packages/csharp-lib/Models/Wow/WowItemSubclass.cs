using System.ComponentModel.DataAnnotations;

namespace Wowthing.Lib.Models.Wow;

public class WowItemSubclass
{
    [Key]
    public short Id { get; set; }

    public short AuctionHouseSortOrder { get; set; }
    public short ClassId { get; set; }
    public short SubclassId { get; set; }
}
