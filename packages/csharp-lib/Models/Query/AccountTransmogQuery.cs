namespace Wowthing.Lib.Models.Query;

[Keyless]
public class AccountTransmogQuery
{
    public List<int> IllusionIds { get; set; }
    public List<int> TransmogIds { get; set; }

    public static string Sql = @"
WITH character_ids AS (
    SELECT  pc.id
    FROM    player_character pc
    LEFT JOIN player_account pa ON pa.id = pc.account_id
    WHERE   pa.enabled = TRUE AND pa.user_id = {0}
),
exploded AS (
    SELECT
        DISTINCT illusion_id, transmog_id
    FROM
        player_character_transmog pct,
        UNNEST(illusion_ids, transmog_ids) AS temp(illusion_id, transmog_id)
    WHERE
        pct.character_id IN (SELECT id FROM character_ids)
)
SELECT
    COALESCE(ARRAY_AGG(illusion_id) FILTER (WHERE illusion_id IS NOT NULL), '{{}}') AS illusion_ids,
    COALESCE(ARRAY_AGG(transmog_id) FILTER (WHERE transmog_id IS NOT NULL), '{{}}') AS transmog_ids
FROM
    exploded
";
}
