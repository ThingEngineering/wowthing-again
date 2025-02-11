using Wowthing.Lib.Models.Wow;
using Wowthing.Tool.Converters.Static;

namespace Wowthing.Tool.Models.Static;

[JsonConverter(typeof(StaticPetConverter))]
public class StaticPet : WowPet
{
    public string Name { get; set; }

    public StaticPet(WowPet pet) : base(pet.Id)
    {
        CreatureId = pet.CreatureId;
        Flags = pet.Flags;
        PetType = pet.PetType;
        SourceType = pet.SourceType;
        SpellId = pet.SpellId;
        ItemIds = pet.ItemIds.Order().ToList();
    }
}
