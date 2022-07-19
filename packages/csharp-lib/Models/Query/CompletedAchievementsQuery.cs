namespace Wowthing.Lib.Models.Query;

[Keyless]
public class CompletedAchievementsQuery
{
    public int AchievementId { get; set; }
    public int Timestamp { get; set; }
        
    public static string UserQuery = @"
SELECT achievement_id, MIN(timestamp) AS timestamp
FROM (
    SELECT  UNNEST(pca.achievement_ids) AS achievement_id,
            UNNEST(pca.achievement_timestamps) AS timestamp
    FROM    player_character_achievements pca
    LEFT JOIN player_character pc ON pc.id = pca.character_id
    LEFT JOIN player_account pa ON pa.id = pc.account_id
    WHERE   pa.user_id = {0}
) oof
GROUP BY achievement_id
        ";
}