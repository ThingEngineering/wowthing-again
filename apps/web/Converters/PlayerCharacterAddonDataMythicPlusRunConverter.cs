﻿using Wowthing.Lib.Models.Player;

namespace Wowthing.Web.Converters;

public class PlayerCharacterAddonDataMythicPlusRunConverter : JsonConverter<PlayerCharacterAddonDataMythicPlusRun>
{
    public override PlayerCharacterAddonDataMythicPlusRun Read(ref Utf8JsonReader reader, Type typeToConvert,
        JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, PlayerCharacterAddonDataMythicPlusRun run, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue(run.MapId);
        writer.WriteNumberValue(run.Level);
        writer.WriteNumberValue(run.Score);
        writer.WriteNumberValue(run.Completed ? 1 : 0);

        writer.WriteEndArray();
    }
}
