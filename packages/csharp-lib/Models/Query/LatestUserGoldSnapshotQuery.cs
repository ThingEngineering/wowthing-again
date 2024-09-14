namespace Wowthing.Lib.Models.Query;

[Keyless]
public class LatestUserGoldSnapshotQuery
{
    public long? UserId { get; set; }
    public int Gold { get; set; }

    public static string Sql = @"
SELECT DISTINCT ON (user_id)
    user_id,
    LAST_VALUE(gold) OVER wnd AS gold
FROM user_gold_snapshot
WINDOW wnd AS (
    PARTITION BY user_id
    ORDER BY time
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
)
";
}
