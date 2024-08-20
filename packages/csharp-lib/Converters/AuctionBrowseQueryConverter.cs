using Wowthing.Lib.Models.Query;

namespace Wowthing.Lib.Converters;

public class AuctionBrowseQueryConverter : JsonConverter<AuctionBrowseQuery>
{
    public override AuctionBrowseQuery Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, AuctionBrowseQuery value, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        writer.WriteStringValue(value.GroupKey);
        writer.WriteNumberValue(value.TotalQuantity);
        writer.WriteNumberValue(value.LowestBuyoutPrice);
        writer.WriteEndArray();
    }
}
