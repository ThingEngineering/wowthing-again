namespace Wowthing.Lib.Models.Query;

[Keyless]
public class SchedulerUserQuery
{
    public long UserId { get; set; }

    public static string SqlQuery = @"
SELECT  u.id AS user_id
FROM    asp_net_users u
LEFT JOIN asp_net_user_tokens ut ON u.id = ut.user_id
WHERE   ut.login_provider = 'BattleNet'
        AND ut.name = 'expires_at'
        AND (ut.value::timestamp - '10 minute'::interval) > current_timestamp
        AND u.last_api_check != '-infinity'
        AND u.last_api_check < (current_timestamp - '10 minute'::interval)
";
}
