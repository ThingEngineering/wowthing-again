namespace Wowthing.Lib.Models.Query;

[Keyless]
public class AccountTransmogQuery
{
    public List<int> TransmogIds { get; set; }

    public static string Sql = @"
WITH character_ids AS (
    SELECT  pc.id
    FROM    player_character pc
    LEFT JOIN player_account pa ON pa.id = pc.account_id
    WHERE pa.user_id = {0}
)
SELECT  COALESCE(ARRAY_AGG(DISTINCT transmog_id), '{{}}') AS transmog_ids
FROM (
    SELECT  UNNEST(transmog_ids) AS transmog_id
    FROM    player_character_transmog
    WHERE   character_id IN (SELECT id FROM character_ids)
) temp1
";
}