namespace Wowthing.Lib.Models.Query;

[Keyless]
public class LatestPlayerAccountGoldSnapshotQuery
{
    public int AccountId { get; set; }
    public int RealmId { get; set; }
    public int Gold { get; set; }

    public static string Sql = @"
SELECT DISTINCT ON (account_id, realm_id)
    account_id,
    realm_id,
    LAST_VALUE(gold) OVER wnd AS gold
FROM player_account_gold_snapshot
WINDOW wnd AS (
    PARTITION BY account_id, realm_id
    ORDER BY time
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
)
";
}
