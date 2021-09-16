using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Wowthing.Lib.Models.Query
{
    [Keyless]
    public class MountQuery
    {
        public List<int> Mounts { get; set; }
        public List<int> AddonMounts { get; set; }
        
        public static string USER_QUERY = @"
WITH character_ids AS (
    SELECT  pc.id
    FROM    player_character pc
    LEFT JOIN player_account pa ON pa.id = pc.account_id
    WHERE pa.user_id = {0}
)
SELECT  ARRAY_AGG(DISTINCT sigh_pcm.mount_id) AS mounts,
        ARRAY_AGG(DISTINCT sigh_pcam.mount_id) AS addon_mounts
FROM
    (
        SELECT  UNNEST(mounts) AS mount_id
        FROM    player_character_mounts pcm
        WHERE   pcm.character_id IN (SELECT id FROM character_ids)
    ) sigh_pcm,
    (
        SELECT  UNNEST(pcam.mounts) AS mount_id
        FROM    player_character_addon_mounts pcam
        WHERE   pcam.character_id IN (SELECT id FROM character_ids)
    ) sigh_pcam
";
    }
}
