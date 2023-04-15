namespace Wowthing.Lib.Models.Query;

[Keyless]
public class MountQuery
{
    public List<int> Mounts { get; set; }
    public List<int> AddonMounts { get; set; }

    public static string UserQuery = @"
WITH character_ids AS (
    SELECT  pc.id
    FROM    player_character pc
    LEFT JOIN player_account pa ON pa.id = pc.account_id
    WHERE   pa.enabled = TRUE AND pa.user_id = {0}
)
SELECT  mounts.mounts,
        addon_mounts.addon_mounts
FROM
    (
        SELECT  COALESCE(ARRAY_AGG(DISTINCT mount_id), '{{}}') AS mounts
        FROM (
            SELECT  UNNEST(mounts) AS mount_id
            FROM    player_character_mounts
            WHERE   character_id IN (SELECT id FROM character_ids)
        ) temp1
    ) mounts,
    (
        SELECT  COALESCE(ARRAY_AGG(DISTINCT mount_id), '{{}}') AS addon_mounts
        FROM (
            SELECT  UNNEST(mounts) AS mount_id
            FROM    player_character_addon_mounts
            WHERE   character_id IN (SELECT id FROM character_ids)
        ) temp2
    ) addon_mounts
";
}
