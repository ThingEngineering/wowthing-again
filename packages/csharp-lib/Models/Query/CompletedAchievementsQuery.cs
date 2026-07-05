namespace Wowthing.Lib.Models.Query;

[Keyless]
public class CompletedAchievementsQuery
{
    public int AchievementId { get; set; }
    public int Timestamp { get; set; }

    public static string UserQuery = @"
SELECT achievement_id, MIN(timestamp) AS timestamp
FROM (
    SELECT  UNNEST(paa.achievement_ids) AS achievement_id,
            UNNEST(paa.achievement_timestamps) AS timestamp
    FROM    player_account_achievements paa
    LEFT JOIN player_account pa ON pa.id = paa.account_id
    WHERE   pa.user_id = {0}
) oof
GROUP BY achievement_id
        ";
}
