using System.Text.Json.Serialization;
using Wowthing.Lib.Converters;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Query;

[JsonConverter(typeof(MissingRecipeQueryConverter))]
[Keyless]
public class MissingRecipeQuery
{
    public int ConnectedRealmId { get; set; }
    public int ItemId { get; set; }
    public WowAuctionTimeLeft TimeLeft { get; set; }
    public long BuyoutPrice { get; set; }

    public const string Sql = @"
SELECT  wa.connected_realm_id,
        wa.item_id,
        wa.time_left,
        wa.buyout_price
FROM (
    SELECT  DISTINCT ON (connected_realm_id, item_id) *
    FROM    wow_auction
    WHERE   connected_realm_id = ANY($1)
            AND item_id = ANY($2)
            AND buyout_price > 0
    ORDER BY connected_realm_id, item_id, buyout_price
) wa
";
}
