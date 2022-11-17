using Wowthing.Backend.Converters.Static;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Backend.Models.Static;

[System.Text.Json.Serialization.JsonConverter(typeof(StaticPetConverter))]
public class StaticPet : WowPet
{
    public string Name { get; set; }

    public StaticPet(WowPet pet)
    {
        Id = pet.Id;
        CreatureId = pet.CreatureId;
        Flags = pet.Flags;
        ItemId = pet.ItemId;
        PetType = pet.PetType;
        SourceType = pet.SourceType;
        SpellId = pet.SpellId;
    }
}
