using Wowthing.Lib.Converters;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Query;

[JsonConverter(typeof(MissingTransmogByAppearanceIdQueryConverter))]
[Keyless]
public class MissingTransmogByAppearanceIdQuery
{
    public int ConnectedRealmId { get; set; }
    public int AppearanceId { get; set; }
    public int ItemId { get; set; }
    public WowAuctionTimeLeft TimeLeft { get; set; }
    public long BuyoutPrice { get; set; }
    public int[] BonusIds { get; set; }

    public const string Sql = @"
WITH cheapest AS (
    SELECT  connected_realm_id,
            appearance_id,
            auction_id
    FROM    wow_auction_cheapest_by_appearance_id
    WHERE   connected_realm_id = ANY($1)
            AND appearance_id = ANY($2)
)
SELECT  wa.connected_realm_id,
        wa.appearance_id,
        wa.item_id,
        wa.time_left,
        wa.buyout_price,
        wa.bonus_ids
FROM    wow_auction wa
INNER JOIN cheapest ch
    ON ch.connected_realm_id = wa.connected_realm_id
        AND ch.auction_id = wa.auction_id
";
}
