using Wowthing.Web.Models;

namespace Wowthing.Web.Converters;

public class UserPetDataPetConverter : JsonConverter<UserPetDataPet>
{
    public override UserPetDataPet Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, UserPetDataPet value, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        writer.WriteNumberValue(value.Level);
        writer.WriteNumberValue((short)value.Quality);
        writer.WriteNumberValue(value.BreedId);
        writer.WriteEndArray();
    }
}
