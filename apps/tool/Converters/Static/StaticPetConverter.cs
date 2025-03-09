using Wowthing.Tool.Models.Static;

namespace Wowthing.Tool.Converters.Static;

public class StaticPetConverter : JsonConverter<StaticPet>
{
    public override StaticPet Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, StaticPet pet, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        writer.WriteNumberValue(pet.Id);
        writer.WriteNumberValue(pet.Flags);
        writer.WriteNumberValue(pet.SourceType);
        writer.WriteNumberValue(pet.PetType);
        writer.WriteNumberValue(pet.CreatureId);
        writer.WriteNumberValue(pet.SpellId);
        writer.WriteStringValue(pet.Name);
        writer.WriteNumberArray(pet.ItemIds);
        writer.WriteEndArray();
    }
}
