using Wowthing.Lib.Converters;

namespace Wowthing.Lib.Models.Query;

[Keyless]
[JsonConverter(typeof(StatisticsQueryConverter))]
public class StatisticsQuery
{
    public int CharacterId { get; set; }
    public int StatisticId { get; set; }
    public int Quantity { get; set; }
    public string Description { get; set; }

    public static string UserQuery = @"
SELECT *
FROM (
    SELECT  pcs.character_id,
            UNNEST(pcs.statistic_ids) AS statistic_id,
            UNNEST(pcs.statistic_quantities) AS quantity,
            UNNEST(pcs.statistic_descriptions) AS description
    FROM    player_character_statistics pcs
    LEFT JOIN player_character pc ON pc.id = pcs.character_id
    LEFT JOIN player_account pa ON pa.id = pc.account_id
    WHERE   pa.user_id = {0}
) oof
ORDER BY statistic_id, quantity DESC, character_id
";
}
