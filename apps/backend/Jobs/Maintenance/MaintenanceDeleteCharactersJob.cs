using Npgsql;
using Wowthing.Lib.Jobs;

namespace Wowthing.Backend.Jobs.Maintenance;

public class MaintenanceDeleteCharactersJob : JobBase, IScheduledJob
{
    public static readonly ScheduledJob Schedule = new ScheduledJob
    {
        Type = JobType.MaintenanceDeleteCharacters,
        Priority = JobPriority.High,
        Interval = TimeSpan.FromHours(1),
        Version = 1,
    };

    private const string DeleteQuery = @"
WITH delete_ids AS (
    SELECT  id
    FROM    player_character
    WHERE   account_id IS NULL
            AND last_api_check < $1
    LIMIT   1000
)
DELETE FROM player_character
WHERE id IN (SELECT id FROM delete_ids)
";

    public override async Task Run(string[] data)
    {
        var oneMonthAgo = DateTime.UtcNow.AddMonths(-1);

        await using var connection = Context.GetConnection();
        await connection.OpenAsync();

        await using (var command = new NpgsqlCommand(DeleteQuery, connection))
        {
            command.Parameters.Add(new() { Value = oneMonthAgo });

            int deleted = await command.ExecuteNonQueryAsync();
            if (deleted > 0)
            {
                Logger.Information("Deleted {count} character(s)", deleted);
            }
        }
    }
}
