using Wowthing.Lib.Models.Wow;

namespace Wowthing.Tool.Models.Static;

public class StaticCharacterClass : WowCharacterClass
{
    public string Name { get; set; }

    public StaticCharacterClass(WowCharacterClass dbClass) : base(dbClass.Id)
    {
        ArmorMask = dbClass.ArmorMask;
        RolesMask = dbClass.RolesMask;
        Slug = dbClass.Slug;
    }
}
