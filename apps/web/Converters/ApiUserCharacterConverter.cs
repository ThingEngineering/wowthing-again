﻿using Wowthing.Web.Models.Api.User;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Wowthing.Web.Converters;

public class ApiUserCharacterConverter : JsonConverter<ApiUserCharacter>
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
        writer.WriteNumberValue(character.Level);
        writer.WriteNumberValue(character.LevelXp);
        writer.WriteNumberValue(character.ChromieTime);
        writer.WriteNumberValue(character.ClassId);
        writer.WriteNumberValue(character.EquippedItemLevel);
        writer.WriteNumberValue((int)character.Faction);
        writer.WriteNumberValue((int)character.Gender);
        writer.WriteNumberValue(character.GuildId);
        writer.WriteNumberValue(character.PlayedTotal);
        writer.WriteNumberValue(character.RaceId);
        writer.WriteNumberValue(character.RealmId);
        writer.WriteNumberValue(character.RestedExperience);
        writer.WriteNumberValue(character.Gold);
        writer.WriteStringValue(character.CurrentLocation);
        writer.WriteStringValue(character.HearthLocation);
        writer.WriteNumberValue(character.LastApiModified.ToUnixTimeSeconds());
        writer.WriteNumberValue(character.LastSeenAddon.ToUnixTimeSeconds());
        writer.WriteNumberValue(character.ScannedCurrencies?.ToUnixTimeSeconds() ?? 0);

        JsonSerializer.Serialize(writer, character.Configuration, options);

        JsonSerializer.Serialize(writer, character.Auras, options); // 25
        JsonSerializer.Serialize(writer, character.EquippedItems, options); // 26
        JsonSerializer.Serialize(writer, character.Garrisons, options); // 27
        JsonSerializer.Serialize(writer, character.GarrisonTrees, options); // 28
        JsonSerializer.Serialize(writer, character.HighestItemLevel, options); // 29
        JsonSerializer.Serialize(writer, character.KnownSpells, options); // 30
        JsonSerializer.Serialize(writer, character.Lockouts, options); // 31
        JsonSerializer.Serialize(writer, character.MythicPlus, options); // 32
        JsonSerializer.Serialize(writer, character.MythicPlusAddon, options); // 33
        JsonSerializer.Serialize(writer, character.MythicPlusSeasons, options); // 34
        JsonSerializer.Serialize(writer, character.Paragons, options); // 35
        JsonSerializer.Serialize(writer, character.PatronOrders, options); // 36
        JsonSerializer.Serialize(writer, character.Professions, options); // 37
        JsonSerializer.Serialize(writer, character.ProfessionCooldowns, options); // 38
        JsonSerializer.Serialize(writer, character.ProfessionSpecializations, options); // 39
        JsonSerializer.Serialize(writer, character.ProfessionTraits, options); // 40
        JsonSerializer.Serialize(writer, character.RaiderIo, options); // 41
        JsonSerializer.Serialize(writer, character.Reputations, options); // 42
        JsonSerializer.Serialize(writer, character.Shadowlands, options); // 43
        JsonSerializer.Serialize(writer, character.Weekly, options); // 44

        JsonSerializer.Serialize(writer, character.RawCurrencies, options); // 45
        JsonSerializer.Serialize(writer, character.RawItems, options); // 46
        JsonSerializer.Serialize(writer, character.RawMythicPlusWeeks, options); // 47
        JsonSerializer.Serialize(writer, character.RawSpecializations, options); // 48
        JsonSerializer.Serialize(writer, character.RawStatistics, options); // 49

        writer.WriteEndArray();
    }
}
