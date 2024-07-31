using System.Text.Json;
using System.Text.Json.Serialization;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Lib.Converters;

public class WowAuctionConverter : JsonConverter<WowAuction>
{
    public override WowAuction Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, WowAuction auction, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue(auction.ConnectedRealmId);
        writer.WriteNumberValue(auction.Context);
        writer.WriteNumberValue(auction.Quantity);
        writer.WriteNumberValue((int)auction.TimeLeft);
        writer.WriteNumberValue(auction.ItemId);
        writer.WriteNumberValue(auction.PetSpeciesId);
        writer.WriteNumberValue(auction.PetBreedId);
        writer.WriteNumberValue(auction.PetLevel);
        writer.WriteNumberValue(auction.PetQuality);
        writer.WriteNumberValue(auction.BidPrice);
        writer.WriteNumberValue(auction.BuyoutPrice);

        writer.WriteNumberArray(auction.BonusIds.EmptyIfNull());
        writer.WriteNumberArray(auction.ModifierTypes.EmptyIfNull().Select(t => (int)t));
        writer.WriteNumberArray(auction.ModifierValues.EmptyIfNull());

        writer.WriteEndArray();
    }
}
