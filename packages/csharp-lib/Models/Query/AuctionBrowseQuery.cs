using Wowthing.Lib.Models.Wow;

namespace Wowthing.Lib.Models.Query;

[Keyless]
public class AuctionBrowseQuery
{
    public long LowestBuyoutPrice { get; set; }
    public long TotalQuantity { get; set; }
    public string GroupKey { get; set; }

    public const string Sql = @"
SELECT  CASE
            WHEN pet_species_id > 0 THEN 'pet:' || pet_species_id
            WHEN appearance_source IS NOT NULL THEN 'source:' || appearance_source
            ELSE 'item:' || item_id
        END AS group_key,
        MIN(buyout_price) AS lowest_buyout_price,
        SUM(quantity) AS total_quantity
FROM    wow_auction wa
WHERE   connected_realm_id = ANY({0})
        AND item_id = ANY({1})
GROUP BY group_key
";
}
