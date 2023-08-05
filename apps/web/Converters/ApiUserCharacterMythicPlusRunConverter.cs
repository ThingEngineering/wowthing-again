using System.Text.Json;
using Wowthing.Web.Models.Api.User;

namespace Wowthing.Web.Converters;

public class ApiUserCharacterMythicPlusRunConverter : System.Text.Json.Serialization.JsonConverter<ApiUserCharacterMythicPlusRun>
{
    public override ApiUserCharacterMythicPlusRun Read(ref Utf8JsonReader reader, Type typeToConvert,
        JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, ApiUserCharacterMythicPlusRun run, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        writer.WriteNumberValue(run.MapId);
        writer.WriteNumberValue(run.Level);
        writer.WriteNumberValue(run.Score);
        writer.WriteNumberValue(run.Completed ? 1 : 0);
        writer.WriteEndArray();
    }
}
