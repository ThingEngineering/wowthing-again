namespace Wowthing.Lib.Models.Query;

[Keyless]
public class PlayerAccountGoldSnapshotQuery
{
    public int AccountId { get; set; }
    public int RealmId { get; set; }
    public int TotalGold { get; set; }

    public static string SqlQuery = @"
WITH pc AS (
    SELECT
        pc.account_id,
        pc.realm_id,
        (SUM(pc.copper) / 10000)::integer AS total_gold
    FROM
        player_character pc
    WHERE
        pc.account_id IS NOT NULL
    GROUP BY
        pc.account_id,
        pc.realm_id
),
pags AS (
    SELECT DISTINCT
        account_id,
        realm_id,
        0 AS snapshot_gold
    FROM
        player_account_gold_snapshot pags
)
SELECT
    COALESCE(pc.account_id, pags.account_id) AS account_id,
    COALESCE(pc.realm_id, pags.realm_id) AS realm_id,
    COALESCE(pc.total_gold, 0) AS total_gold
FROM
    pc
FULL OUTER JOIN
    pags ON pc.account_id = pags.account_id AND pc.realm_id = pags.realm_id
";
}
