namespace Wowthing.Lib.Models.Query
{
    [Keyless]
    public class AchievementCriteriaQuery
    {
        public int CharacterId { get; set; }
        public int CriteriaId { get; set; }
        public long Amount { get; set; }
        
        public static string UserQuery = @"
SELECT *
FROM (
    SELECT  pca.character_id,  
            UNNEST(pca.criteria_ids) AS criteria_id,
            UNNEST(pca.criteria_amounts) AS amount
    FROM    player_character_achievements pca
    LEFT JOIN player_character pc ON pc.id = pca.character_id
    LEFT JOIN player_account pa ON pa.id = pc.account_id
    WHERE   pa.user_id = {0}
) oof
WHERE amount > 0
ORDER BY criteria_id, amount DESC
";
    }
}
