using System.Text.Json;
using Wowthing.Web.Models.Api.User;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Wowthing.Web.Converters;

public class ApiUserCharacterConverter : System.Text.Json.Serialization.JsonConverter<ApiUserCharacter>
{
    public override ApiUserCharacter Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, ApiUserCharacter character, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue(character.Id);
        writer.WriteStringValue(character.Name);
        writer.WriteNumberValue(character.IsResting ? 1 : 0);
        writer.WriteNumberValue(character.IsWarMode ? 1 : 0);
        writer.WriteNumberValue(character.AccountId);
        writer.WriteNumberValue(character.ActiveSpecId);
        writer.WriteNumberValue(character.AddonLevel);
        writer.WriteNumberValue(character.AddonLevelXp);
        writer.WriteNumberValue(character.ChromieTime);
        writer.WriteNumberValue(character.ClassId);
        writer.WriteNumberValue(character.EquippedItemLevel);
        writer.WriteNumberValue((int)character.Faction);
        writer.WriteNumberValue((int)character.Gender);
        writer.WriteNumberValue(character.GuildId);
        writer.WriteNumberValue(character.Level);
        writer.WriteNumberValue(character.PlayedTotal);
        writer.WriteNumberValue(character.RaceId);
        writer.WriteNumberValue(character.RealmId);
        writer.WriteNumberValue(character.RestedExperience);
        writer.WriteNumberValue(character.Gold);
        writer.WriteStringValue(character.CurrentLocation);
        writer.WriteStringValue(character.HearthLocation);
        writer.WriteNumberValue(character.LastSeenAddon.ToUnixTimeSeconds());

        JsonSerializer.Serialize(writer, character.Configuration, options);

        JsonSerializer.Serialize(writer, character.Auras, options);
        // JsonSerializer.Serialize(writer, character.Bags, options);
        // JsonSerializer.Serialize(writer, character.CurrencyItems, options);
        JsonSerializer.Serialize(writer, character.EquippedItems, options);
        JsonSerializer.Serialize(writer, character.Garrisons, options);
        JsonSerializer.Serialize(writer, character.GarrisonTrees, options);
        JsonSerializer.Serialize(writer, character.Lockouts, options);
        JsonSerializer.Serialize(writer, character.MythicPlus, options);
        JsonSerializer.Serialize(writer, character.MythicPlusAddon, options);
        JsonSerializer.Serialize(writer, character.MythicPlusSeasons, options);
        JsonSerializer.Serialize(writer, character.Paragons, options);
        JsonSerializer.Serialize(writer, character.Professions, options);
        JsonSerializer.Serialize(writer, character.ProfessionTraits, options);
        // JsonSerializer.Serialize(writer, character.ProgressItems, options);
        JsonSerializer.Serialize(writer, character.RaiderIo, options);
        JsonSerializer.Serialize(writer, character.Reputations, options);
        JsonSerializer.Serialize(writer, character.Shadowlands, options);
        JsonSerializer.Serialize(writer, character.Weekly, options);

        JsonSerializer.Serialize(writer, character.RawCurrencies, options);
        JsonSerializer.Serialize(writer, character.RawItems, options);
        JsonSerializer.Serialize(writer, character.RawMythicPlusWeeks, options);
        JsonSerializer.Serialize(writer, character.RawSpecializations, options);
        JsonSerializer.Serialize(writer, character.RawStatistics, options);

        writer.WriteEndArray();
    }
}
