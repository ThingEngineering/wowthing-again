using Wowthing.Lib.Models.Wow;

namespace Wowthing.Tool.Models.Static;

public class StaticCharacterSpecialization : WowCharacterSpecialization
{
    public string Name { get; set; }

    public StaticCharacterSpecialization(WowCharacterSpecialization dbSpec)
    {
        Id = dbSpec.Id;
        ClassId = dbSpec.ClassId;
        Order = dbSpec.Order;
        Role = dbSpec.Role;
        PrimaryStat = dbSpec.PrimaryStat;
    }
}
