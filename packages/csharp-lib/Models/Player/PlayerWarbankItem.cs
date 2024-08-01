using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Converters;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Player;

[Index(nameof(UserId), nameof(ItemId))]
[JsonConverter(typeof(PlayerWarbankItemConverter))]
public class PlayerWarbankItem : BasePlayerItem
{
    [Key]
    public long Id { get; set; }

    [ForeignKey("User")]
    public long UserId { get; set; }
    public ApplicationUser User { get; set; }

    // Can't be specified as NotMapped in the base class as there's no way to remove it
    [NotMapped]
    public override ItemLocation Location => ItemLocation.WarbandBank;
}
