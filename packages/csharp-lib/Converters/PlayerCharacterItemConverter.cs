using Wowthing.Lib.Enums;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Lib.Converters;

public class PlayerCharacterItemConverter : JsonConverter<PlayerCharacterItem>
{
    public override PlayerCharacterItem Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType != JsonTokenType.StartArray)
        {
            throw new JsonException();
        }

        var item = new PlayerCharacterItem();
        item.Location = (ItemLocation)reader.ReadInt32();
        item.ContainerId = reader.ReadInt16();
        item.Slot = reader.ReadInt16();
        item.ItemId = reader.ReadInt32();
        item.Count = reader.ReadInt32();
        item.Context = reader.ReadInt16();
        item.CraftedQuality = reader.ReadInt16();
        item.EnchantId = reader.ReadInt16();
        item.ItemLevel = reader.ReadInt16();
        item.Quality = reader.ReadInt16();
        item.SuffixId = reader.ReadInt16();

        reader.Read();

        if (reader.TokenType == JsonTokenType.StartArray)
        {
            reader.Read();
            item.BonusIds = new();
            while (reader.TokenType != JsonTokenType.EndArray)
            {
                item.BonusIds.Add(reader.GetInt16());
                reader.Read();
            }

            reader.Read();
        }

        if (reader.TokenType == JsonTokenType.StartArray)
        {
            reader.Read();
            item.Gems = new();
            while (reader.TokenType != JsonTokenType.EndArray)
            {
                item.Gems.Add(reader.GetInt32());
                reader.Read();
            }

            reader.Read();
        }

        return item;
    }

    public override void Write(Utf8JsonWriter writer, PlayerCharacterItem item, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue((int)item.Location);

        options.GetTypedConverter<BasePlayerItem>().Write(writer, item, options);

        writer.WriteEndArray();
    }
}
