using Wowthing.Lib.Jobs;

namespace Wowthing.Backend.Jobs.Maintenance;

public class MaintenanceUnlinkCharactersJob : JobBase, IScheduledJob
{
    public static readonly ScheduledJob Schedule = new ScheduledJob
    {
        Type = JobType.MaintenanceUnlinkCharacters,
        Priority = JobPriority.High,
        Interval = TimeSpan.FromHours(24),
        Version = 1,
    };

    private const string UnlinkQuery = @"
UPDATE  player_character
SET     account_id = null
WHERE   account_id IN (
    SELECT  id
    FROM    player_account
    WHERE   user_id IN (
        SELECT  id
        FROM    asp_net_users
        WHERE   last_api_check < (CURRENT_TIMESTAMP - '3 months'::interval)
    )
)
";

    public override async Task Run(params string[] data)
    {
        await using var connection = Context.GetConnection();
        await connection.OpenAsync();
        await using var command = connection.CreateCommand();
        command.CommandText = UnlinkQuery;
        int updated = await command.ExecuteNonQueryAsync();
        Logger.Information("Unlinked {count} character(s)", updated);
    }
}
