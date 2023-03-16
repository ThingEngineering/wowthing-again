using System.ComponentModel.DataAnnotations;

namespace Wowthing.Lib.Models.Wow;

public class WowCharacterClass
{
    [Key]
    public short Id { get; set; }

    public short ArmorMask { get; set; }
    public short RolesMask { get; set; }

    public string Slug { get; set; }

    public WowCharacterClass(short id)
    {
        Id = id;
    }
}
