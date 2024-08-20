using Wowthing.Lib.Converters;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Query;

[JsonConverter(typeof(MissingTransmogByAppearanceSourceQueryConverter))]
[Keyless]
public class MissingTransmogByAppearanceSourceQuery
{
    public int ConnectedRealmId { get; set; }
    public string AppearanceSource { get; set; }
    public int ItemId { get; set; }
    public WowAuctionTimeLeft TimeLeft { get; set; }
    public long BuyoutPrice { get; set; }
    public int[] BonusIds { get; set; }

    public const string Sql = @"
WITH cheapest AS (
    SELECT  connected_realm_id,
            appearance_source,
            auction_id
    FROM    wow_auction_cheapest_by_appearance_source
    WHERE   connected_realm_id = ANY($1)
            AND appearance_source = ANY($2)
)
SELECT ranked.*
FROM (
    SELECT  wa.connected_realm_id,
            wa.appearance_source,
            wa.item_id,
            wa.time_left,
            wa.buyout_price,
            wa.bonus_ids,
            RANK() OVER (
                PARTITION BY wa.appearance_source
                ORDER BY buyout_price
            ) AS rank
    FROM    wow_auction wa
    INNER JOIN cheapest ch
        ON ch.connected_realm_id = wa.connected_realm_id
            AND ch.auction_id = wa.auction_id
) ranked
WHERE rank <= 5
";
}
