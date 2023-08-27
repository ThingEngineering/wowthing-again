using Wowthing.Tool.Models.Items;

namespace Wowthing.Tool.Converters.Items;

public class RedisItemDataConverter : JsonConverter<RedisItemData>
{
    public override RedisItemData Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, RedisItemData item, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue(item.Id);
        writer.WriteNumberValue(item.GetCalculatedClassMask());
        writer.WriteNumberValue(item.RaceMask);
        writer.WriteNumberValue(item.Stackable);
        writer.WriteNumberValue(item.ClassId);
        writer.WriteNumberValue(item.SubclassId);
        writer.WriteNumberValue((int)item.InventoryType);
        writer.WriteNumberValue(item.ContainerSlots);
        writer.WriteNumberValue((int)item.Quality);
        writer.WriteNumberValue((int)item.PrimaryStat);
        writer.WriteNumberValue((int)item.Flags);
        writer.WriteNumberValue(item.Expansion);
        writer.WriteNumberValue(item.ItemLevel);
        writer.WriteNumberValue(item.RequiredLevel);
        writer.WriteNumberValue((int)item.BindType);
        writer.WriteStringValue(item.Name);

        if (item.Appearances?.Length > 0)
        {
            writer.WriteStartArray();
            foreach (var appearance in item.Appearances.OrderBy(ima => ima.Order))
            {
                writer.WriteStartArray();
                writer.WriteNumberValue(appearance.Modifier);
                writer.WriteNumberValue(appearance.AppearanceId);
                writer.WriteNumberValue(appearance.SourceType);
                writer.WriteEndArray();
            }
            writer.WriteEndArray();
        }

        writer.WriteEndArray();
    }
}
