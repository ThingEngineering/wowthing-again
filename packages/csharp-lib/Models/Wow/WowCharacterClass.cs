using System.ComponentModel.DataAnnotations;

namespace Wowthing.Lib.Models.Wow;

public class WowCharacterClass
{
    [Key]
    public short Id { get; set; }

    public short ArmorMask { get; set; }
    public short RolesMask { get; set; }
}
