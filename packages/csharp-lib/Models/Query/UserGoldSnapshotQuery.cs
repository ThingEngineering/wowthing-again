namespace Wowthing.Lib.Models.Query;

[Keyless]
public class UserGoldSnapshotQuery
{
    public long UserId { get; set; }
    public int TotalGold { get; set; }

    public static string SqlQuery = @"
SELECT
    user_id,
    (warbank_copper / 10000)::integer AS total_gold
FROM
    user_addon_data
";
}
