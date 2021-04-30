using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Channels;
using Wowthing.Backend.Models.Redis;
using Wowthing.Lib.Jobs;

namespace Wowthing.Backend.Services
{
    public class StateService
    {
        public ChannelReader<WorkerJob> JobQueueReader;
        public RedisAccessToken AccessToken;

        public StateService()
        {
        }
    }
}
