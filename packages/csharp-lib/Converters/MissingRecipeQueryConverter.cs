using Wowthing.Lib.Models.Query;

namespace Wowthing.Lib.Converters;

public class MissingRecipeQueryConverter : JsonConverter<MissingRecipeQuery>
{
    public override MissingRecipeQuery Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, MissingRecipeQuery auction, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue(auction.ConnectedRealmId);
        writer.WriteNumberValue((int)auction.TimeLeft);
        writer.WriteNumberValue(auction.ItemId);
        writer.WriteNumberValue(auction.BuyoutPrice);

        writer.WriteEndArray();
    }
}
