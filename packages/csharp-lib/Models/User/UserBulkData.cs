using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Lib.Models.User;

public class UserBulkData
{
    [Key, ForeignKey("User")]
    public long UserId { get; set; }
    public ApplicationUser User { get; set; }

    public DateTime HeirloomsUpdatedAt { get; set; }
    public DateTime MountsUpdatedAt { get; set; }
    public DateTime PetsUpdatedAt { get; set; }
    public DateTime ToysUpdatedAt { get; set; }
    public DateTime TransmogsUpdatedAt { get; set; }

    public List<int> TransmogIds { get; set; }

    public List<short> MountIds { get; set; }
    public List<short> ToyIds { get; set; }

    [Column(TypeName = "jsonb")]
    public Dictionary<int, int> Heirlooms { get; set; }

    [Column(TypeName = "jsonb")]
    public Dictionary<long, PlayerAccountPetsPet> Pets { get; set; }
}
