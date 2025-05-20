using Wowthing.Web.Models.Api.User;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Wowthing.Web.Converters;

public class ApiUserGuildConverter : JsonConverter<ApiUserGuild>
{
    public override ApiUserGuild Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, ApiUserGuild guild, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue(guild.Id);
        writer.WriteNumberValue(guild.RealmId);
        writer.WriteStringValue(guild.Name);
        writer.WriteStringValue(guild.Slug);

        JsonSerializer.Serialize(writer, guild.RawItems, options);

        writer.WriteEndArray();
    }
}
