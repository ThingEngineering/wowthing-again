using Microsoft.EntityFrameworkCore;

namespace Wowthing.Lib.Models.Query
{
    [Keyless]
    public class MountQuery
    {
        public int MountId { get; set; }
        
        public static string USER_QUERY = @"
WITH character_ids AS (
    SELECT  pc.id
    FROM    player_character pc
    LEFT JOIN player_account pa ON pa.id = pc.account_id
    WHERE pa.user_id = {0}
)
SELECT DISTINCT mount_id
FROM (
    SELECT  UNNEST(pcm.mounts) AS mount_id
    FROM    player_character_mounts pcm
    WHERE   pcm.character_id IN (SELECT id FROM character_ids)
    UNION
    SELECT  UNNEST(pcam.mounts) AS mount_id
    FROM    player_character_addon_mounts pcam
    WHERE   pcam.character_id IN (SELECT id FROM character_ids)
) oof
ORDER BY mount_id
";
    }
}
