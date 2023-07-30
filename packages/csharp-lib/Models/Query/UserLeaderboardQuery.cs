namespace Wowthing.Lib.Models.Query;

[Keyless]
public class UserLeaderboardQuery
{
    public long UserId { get; set; }

    public int AppearanceIdCount { get; set; }
    public int AppearanceSourceCount { get; set; }
    public int CompletedQuestCount { get; set; }

    public short IllusionCount { get; set; }
    public short MountCount { get; set; }
    public short ToyCount { get; set; }

    public const string Sql = @"
SELECT  anu.id AS user_id,
        uc.appearance_id_count,
        uc.appearance_source_count,
        uc.completed_quest_count,
        uc.illusion_count,
        uc.mount_count,
        uc.toy_count
FROM    asp_net_users anu
INNER JOIN (
    SELECT  user_id,
            COALESCE(completed_quests, 0) AS completed_quest_count,
            COALESCE(ARRAY_LENGTH(appearance_ids, 1), 0) AS appearance_id_count,
            COALESCE(ARRAY_LENGTH(appearance_sources, 1), 0) AS appearance_source_count,
            COALESCE(ARRAY_LENGTH(illusion_ids, 1), 0)::smallint AS illusion_count,
            COALESCE(ARRAY_LENGTH(mount_ids, 1), 0)::smallint AS mount_count,
            COALESCE(ARRAY_LENGTH(toy_ids, 1), 0)::smallint AS toy_count
    FROM    user_cache
) uc ON uc.user_id = anu.id
WHERE   anu.last_api_check != '-infinity'
        AND (current_timestamp - anu.last_api_check) < '3 months'::interval
";
}
