using Wowthing.Lib.Jobs;

namespace Wowthing.Backend.Jobs.Maintenance;

public class MaintenanceDeleteAchievementsJob : JobBase, IScheduledJob
{
    public static readonly ScheduledJob Schedule = new ScheduledJob
    {
        Type = JobType.MaintenanceDeleteAchievements,
        Priority = JobPriority.High,
        Interval = TimeSpan.FromHours(1),
        Version = 1,
    };

    private const string DeleteQuery = @"
DELETE FROM player_character_achievements
WHERE   character_id IN (
    SELECT  character_id
    FROM    player_character_achievements
    WHERE   character_id IN (
        SELECT  id
        FROM    player_character pc
        WHERE   account_id IS NULL
    )
    LIMIT 1000
)
";

    public override async Task Run(string[] data)
    {
        await using var connection = Context.GetConnection();
        await connection.OpenAsync();
        await using var command = connection.CreateCommand();
        command.CommandText = DeleteQuery;
        int deleted = await command.ExecuteNonQueryAsync();
        if (deleted > 0)
        {
            Logger.Information("Deleted {count} character(s) achievements", deleted);
        }
    }
}
