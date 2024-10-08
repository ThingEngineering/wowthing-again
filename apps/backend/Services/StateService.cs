﻿using System.Threading.Channels;
using Wowthing.Backend.Models.Redis;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Services;

public class StateService
{
    public Channel<long> FailedQueuedJobs { get; }
    public Channel<long> SuccessfulQueuedJobs { get; }
    public RedisAccessToken AccessToken;
    public Dictionary<JobPriority, Channel<QueuedJob>> JobPriorityChannels { get; } = new();

    public StateService()
    {
        foreach (var priority in EnumUtilities.GetValues<JobPriority>())
        {
            JobPriorityChannels[priority] = Channel.CreateUnbounded<QueuedJob>(new UnboundedChannelOptions
            {
                SingleReader = false,
                SingleWriter = true,
            });
        }

        FailedQueuedJobs = Channel.CreateUnbounded<long>(new UnboundedChannelOptions
        {
            SingleReader = true,
            SingleWriter = false,
        });
        SuccessfulQueuedJobs = Channel.CreateUnbounded<long>(new UnboundedChannelOptions
        {
            SingleReader = true,
            SingleWriter = false,
        });
    }
}
