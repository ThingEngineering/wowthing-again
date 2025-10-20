using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Query;

[Keyless]
public class ActiveConnectedRealmQuery
{
    public int ConnectedRealmId { get; set; }
    public WowRegion Region { get; set; }

    // This is a wacky Postgres version of a "loose indexscan" because DISTINCT is
    // not very fast.
    // https://wiki.postgresql.org/wiki/Loose_indexscan#Selecting_Distinct_Values
    public static readonly string Sql = @"
WITH yikes AS (
    WITH RECURSIVE t AS (
        SELECT min(realm_id) AS realm_id
        FROM player_character
        UNION ALL
        SELECT (
            SELECT min(realm_id)
            FROM player_character
            WHERE realm_id > t.realm_id
        )
        FROM t
        WHERE t.realm_id IS NOT NULL
    )
    SELECT realm_id
    FROM t
    WHERE realm_id IS NOT NULL
    UNION ALL
    SELECT null
    WHERE EXISTS (
        SELECT 1
        FROM player_character
        WHERE realm_id IS NULL
    )
)
SELECT DISTINCT ON (wr.connected_realm_id) wr.connected_realm_id, wr.region
FROM yikes
INNER JOIN wow_realm wr ON yikes.realm_id = wr.id
WHERE wr.connected_realm_id > 0
";
}
