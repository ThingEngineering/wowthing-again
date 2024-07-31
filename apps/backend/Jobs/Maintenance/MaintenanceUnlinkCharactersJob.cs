using Wowthing.Lib.Jobs;

namespace Wowthing.Backend.Jobs.Maintenance;

public class MaintenanceUnlinkCharactersJob : JobBase, IScheduledJob
{
    public static readonly ScheduledJob Schedule = new ScheduledJob
    {
        Type = JobType.MaintenanceUnlinkCharacters,
        Priority = JobPriority.High,
        Interval = TimeSpan.FromHours(1),
        Version = 1,
    };

    private const string UnlinkQuery = @"
UPDATE  player_character
SET     account_id = null
WHERE   character_id IN (
    SELECT  id
    FROM    player_character
    WHERE   account_id IN (
        SELECT  id
        FROM    player_account
        WHERE   user_id IN (
            SELECT  id
            FROM    asp_net_users
            WHERE   last_api_check < (CURRENT_TIMESTAMP - '3 months'::interval)
        )
    )
    LIMIT 1000
)
";

    public override async Task Run(string[] data)
    {
        await using var connection = Context.GetConnection();
        await connection.OpenAsync();
        await using var command = connection.CreateCommand();
        command.CommandText = UnlinkQuery;
        int updated = await command.ExecuteNonQueryAsync();
        if (updated > 0)
        {
            Logger.Information("Unlinked {count} character(s)", updated);
        }
    }
}
