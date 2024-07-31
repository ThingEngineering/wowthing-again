using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.User;

public class UserCacheAchievementsJob : JobBase
{
    private long _userId;
    private JankTimer _timer;

    public override void Setup(string[] data)
    {
        _userId = long.Parse(data[0]);
        UserLog(_userId);
    }

    public override async Task Run(string[] data)
    {
        _timer = new JankTimer();

        var db = Redis.GetDatabase();
        await CacheService.CreateAchievementCacheAsync(Context, db, _timer, _userId);

        Logger.Debug("{0}", _timer.ToString());
    }
}
