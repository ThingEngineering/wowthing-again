using Wowthing.Lib.Models.Wow;

namespace Wowthing.Backend.Models.Static;

public class StaticCharacterClass : WowCharacterClass
{
    public string Name { get; set; }

    public StaticCharacterClass(WowCharacterClass dbClass)
    {
        Id = dbClass.Id;
        ArmorMask = dbClass.ArmorMask;
        RolesMask = dbClass.RolesMask;
    }
}
