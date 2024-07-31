using Wowthing.Tool.Models.Auctions;

namespace Wowthing.Tool.Converters.Auctions;

public class OutAuctionCategoryConverter : JsonConverter<OutAuctionCategory>
{
    public override OutAuctionCategory Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, OutAuctionCategory category, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue(category.Id);
        writer.WriteNumberValue(category.InventoryType);
        writer.WriteNumberValue(category.ItemClass);
        writer.WriteNumberValue(category.ItemSubClass);
        writer.WriteNumberValue(category.DefaultAuctionHouseFilter);
        writer.WriteStringValue(category.Description);
        writer.WriteStringValue(category.Description.Slugify());

        if (category.Children.Count > 0)
        {
            writer.WriteStartArray();
            foreach (var child in category.Children)
            {
                JsonSerializer.Serialize(writer, child, options);
            }
            writer.WriteEndArray();
        }

        writer.WriteEndArray();
    }
}
