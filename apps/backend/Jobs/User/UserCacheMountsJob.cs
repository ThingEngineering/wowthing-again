﻿using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.User;

public class UserCacheMountsJob : JobBase
{
    private JankTimer _timer;

    public override async Task Run(string[] data)
    {
        _timer = new JankTimer();

        long userId = long.Parse(data[0]);
        using var shrug = UserLog(userId);

        await CacheService.CreateOrUpdateMountCacheAsync(Context, _timer, userId);

        Logger.Debug("{0}", _timer.ToString());
    }
}
