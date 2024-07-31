using Wowthing.Lib.Models.Player;

namespace Wowthing.Lib.Converters;

public class BasePlayerItemConverter : JsonConverter<BasePlayerItem>
{
    public override BasePlayerItem Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, BasePlayerItem item, JsonSerializerOptions options)
    {
        writer.WriteNumberValue(item.ContainerId);
        writer.WriteNumberValue(item.Slot);
        writer.WriteNumberValue(item.ItemId);
        writer.WriteNumberValue(item.Count);
        writer.WriteNumberValue(item.Context);
        writer.WriteNumberValue(item.CraftedQuality);
        writer.WriteNumberValue(item.EnchantId);
        writer.WriteNumberValue(item.ItemLevel);
        writer.WriteNumberValue(item.Quality);
        writer.WriteNumberValue(item.SuffixId);

        if (item.Gems?.Count > 0 || item.BonusIds?.Count > 0)
        {
            writer.WriteNumberArray(item.BonusIds.EmptyIfNull().Select(id => (int)id));
        }

        if (item.Gems?.Count > 0)
        {
            writer.WriteNumberArray(item.Gems);
        }
    }
}
