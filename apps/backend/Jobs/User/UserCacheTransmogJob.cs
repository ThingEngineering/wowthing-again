using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.User;

public class UserCacheTransmogJob : JobBase
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

        await CacheService.CreateOrUpdateTransmogCacheAsync(Context, _timer, _userId, lastModified: DateTime.UtcNow);

        Logger.Debug("{0}", _timer.ToString());
    }
}
