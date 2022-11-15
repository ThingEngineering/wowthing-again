using System.Threading.Channels;
using Wowthing.Backend.Models.Redis;
using Wowthing.Lib.Jobs;

namespace Wowthing.Backend.Services;

public class StateService
{
    public readonly Dictionary<JobPriority, ChannelReader<WorkerJob>> JobQueueReaders = new();
    public RedisAccessToken AccessToken;
}
