using Microsoft.EntityFrameworkCore;

namespace Wowthing.Lib.Models.Query
{
    [Keyless]
    public class CompletedAchievementsQuery
    {
        public int AchievementId { get; set; }
        public int Timestamp { get; set; }
        
        public static string USER_QUERY = @"
SELECT key::integer AS achievement_id, MIN(value::integer) AS timestamp
FROM (
    SELECT  (jsonb_each(pca.achievement_timestamps)).*
    FROM    player_character_achievements pca
    LEFT JOIN player_character pc ON pc.id = pca.character_id
    LEFT JOIN player_account pa ON pa.id = pc.account_id
    WHERE   pa.user_id = {0}
) oof
GROUP BY achievement_id
        ";
    }
}
