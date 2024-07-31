using System.Text.Json.Serialization;
using Wowthing.Lib.Converters;

namespace Wowthing.Lib.Models.Query;

[Keyless]
[JsonConverter(typeof(AuctionBrowseQueryConverter))]
public class AuctionBrowseQuery
{
    public long LowestBuyoutPrice { get; set; }
    public long TotalQuantity { get; set; }
    public string GroupKey { get; set; }

    public const string Sql = @"
SELECT  group_key,
        MIN(buyout_price) AS lowest_buyout_price,
        SUM(quantity) AS total_quantity
FROM    wow_auction wa
WHERE   connected_realm_id = ANY({0})
        AND item_id = ANY({1})
GROUP BY group_key
";
}
